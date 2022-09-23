import express from 'express';
import { Op, OrderItem } from 'sequelize';
import { FindAndCountOptions } from 'sequelize/types';
import { KnockoutFollowupType } from '../../../shared/types/Knockout';
import { CreateSEPBody } from '../../../shared/types/SEP';
import { TaskStatus } from '../../../shared/types/Task';
import Database from '../../models';
import {
  knockoutScreenTemplates,
  dataFieldTemplates,
  dataFieldOptionTemplates,
  knockoutFollowupTemplates,
  taskTemplates,
  taskDependencyTemplates,
} from '../../utils/template-data';
const sepController = {
  getSEPs: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const limit = parseInt(req.query.limit as string) || 25;
    const offset = parseInt(req.query.offset as string) || 0;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortDirection = req.query.sortAsc === 'true' ? 'ASC' : 'DESC';
    let orderArray;
    if (sortBy.includes('creator.')) {
      // sorting by a nested property
      const propName = sortBy.split('.')[1] as string;
      orderArray = [{ model: db.User, as: 'creator' }, propName, sortDirection];
    } else {
      // sorting by a property on the SEP object
      orderArray = [sortBy, sortDirection];
    }
    const search = req.query.search;
    const filters = req.query;
    const options: FindAndCountOptions = {
      where: { deletedAt: null },
      limit,
      offset,
      order: [orderArray as unknown as OrderItem],
      include: [
        {
          model: db.User,
          as: 'creator',
        },
      ],
    };

    // Remove non-filter query params
    delete filters.limit;
    delete filters.offset;
    delete filters.sortBy;
    delete filters.sortAsc;
    delete filters.search;

    // Apply filters
    for (const prop in filters) {
      let propToUse = prop;
      if (propToUse.includes('.')) {
        // Filtering by a nested property, so we need to wrap it in '$' for Sequelize
        propToUse = '$' + propToUse + '$';
      }
      const filterValue = filters[prop] as string;
      if (filterValue?.includes(',')) {
        // Filter with multiple values
        (options.where as any)[propToUse] = { [Op.in]: filterValue.split(',') };
      } else if (filterValue?.length > 0) {
        // Filter with single value
        (options.where as any)[propToUse] = filterValue;
      }
      // ignore filters with empty values
    }

    // Apply search query
    if (search) {
      const searchableFields = [
        'id',
        'createdBy',
        'phase',
        'name',
        'description',
        '$creator.id$',
        '$creator.familyName$',
        '$creator.givenName$',
        '$creator.upn$',
        '$creator.officeLocation$',
        '$creator.email$',
        '$creator.department$',
        '$creator.displayName$',
        '$creator.surname$',
        '$creator.jobTitle$',
      ];
      /** The searchable fields that need to be converted to numbers before being searched */
      const convertToNumber = ['id'];
      (options.where as any)[Op.or] = searchableFields
        .map((searchableField) => ({
          // [searchableField]: { [Op.like]: search as string }
          [searchableField]: {
            [Op.like]: convertToNumber.includes(searchableField)
              ? parseInt(search as string)
              : `%${search as string}%`,
          },
        }))
        // filter out invalid (null, NaN, undefined) values
        .filter((a, idx) => a[searchableFields[idx]][Op.like]);
    }
    const results = await db.SEP.findAndCountAll(options);
    return res.send({ count: results.count, seps: results.rows });
  },
  createSEP: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const { name, description } = req.body as CreateSEPBody;

    const createdSEP = await db.sequelize.transaction(async (transaction) => {
      // Create the new SEP object
      const newSEP = await await db.SEP.create(
        {
          name,
          description,
          createdBy: res.locals.user.oid,
          phase: 'knockout',
        },
        { transaction }
      );
      // Create other SEP-associated data from template data

      // Create Tasks
      const tasks = await db.Task.bulkCreate(
        taskTemplates.map((taskTemplate) => ({
          createdBy: 'system',
          assignedUserID:
            taskTemplate.defaultAssignee === 'requestor'
              ? res.locals.user.oid
              : null,
          departmentID: taskTemplate.departmentID,
          defaultReviewerID: taskTemplate.defaultReviewerID,
          sepID: newSEP.id,
          review: taskTemplate.review,
          name: taskTemplate.name,
          description: taskTemplate.description,
          phase: taskTemplate.phase,
          status: TaskStatus.todo,
          taskTemplateID: taskTemplate.id,
          enabled: false,
        })),
        { transaction }
      );

      // Create TaskDependencies
      await db.TaskDependency.bulkCreate(
        taskDependencyTemplates.map((taskDependencyTemplate) => ({
          taskID: tasks.find(
            (t) => t.taskTemplateID === taskDependencyTemplate.taskTemplateID
          )?.id,
          dependentTaskID: tasks.find(
            (t) =>
              t.taskTemplateID ===
              taskDependencyTemplate.dependentTaskTemplateID
          )?.id,
          status: taskDependencyTemplate.status,
        })),
        { transaction }
      );

      // Create KnockoutScreens
      const knockoutScreens = await db.KnockoutScreen.bulkCreate(
        knockoutScreenTemplates.map((knockoutScreenTemplate) => ({
          name: knockoutScreenTemplate.name,
          description: knockoutScreenTemplate.description,
          starter: knockoutScreenTemplate.starter || false,
          sepID: newSEP.id,
          knockoutScreenTemplateID: knockoutScreenTemplate.id,
        })),
        { transaction }
      );

      // Create DataFields
      const dataFields = await db.DataField.bulkCreate(
        dataFieldTemplates.map((dataFieldTemplate) => ({
          createdBy: 'system',
          name: dataFieldTemplate.name,
          description: dataFieldTemplate.description,
          type: dataFieldTemplate.type,
          knockoutScreenID: knockoutScreens.find(
            (k) =>
              k.knockoutScreenTemplateID ===
              dataFieldTemplate.knockoutScreenTemplateID
          )?.id,
          taskID:
            tasks.find(
              (t) => t.taskTemplateID === dataFieldTemplate.taskTemplateID
            )?.id || null,
          sepID: newSEP.id,
          departmentID: dataFieldTemplate.departmentID || null,
          reviewTab: dataFieldTemplate.reviewTab || false,
          required: dataFieldTemplate.required || false,
          value: null,
          dataFieldTemplateID: dataFieldTemplate.id,
        })),
        { transaction }
      );

      // Create DataFieldOptions
      await db.DataFieldOption.bulkCreate(
        dataFieldOptionTemplates.map((dataFieldOptionTemplate) => ({
          dataFieldID: dataFields.find(
            (d) =>
              d.dataFieldTemplateID ===
              dataFieldOptionTemplate.dataFieldTemplateID
          )?.id,
          sepID: newSEP.id,
          value: dataFieldOptionTemplate.value,
          description: dataFieldOptionTemplate.description,
          selected: dataFieldOptionTemplate.selected || false,
        })),
        { transaction }
      );

      // Create KnockoutFollowups
      await db.KnockoutFollowup.bulkCreate(
        knockoutFollowupTemplates.map((knockoutFollowupTemplate) => ({
          value: knockoutFollowupTemplate.value,
          dataFieldID: dataFields.find(
            (d) =>
              d.dataFieldTemplateID ===
              knockoutFollowupTemplate.dataFieldTemplateID
          )?.id,
          sepID: newSEP.id,
          knockoutFollowupTemplateID: knockoutFollowupTemplate.id,
          followupType: knockoutFollowupTemplate.followupType,
          followupID:
            knockoutFollowupTemplate.followupType === KnockoutFollowupType.Task
              ? tasks.find(
                  (t) =>
                    t.taskTemplateID === knockoutFollowupTemplate.followupID
                )?.id
              : knockoutScreens.find(
                  (k) =>
                    k.knockoutScreenTemplateID ===
                    knockoutFollowupTemplate.followupID
                )?.id,
        })),
        { transaction }
      );
      return newSEP;
    });
    // If the execution reaches this line, the transaction has been committed successfully
    return res.send(createdSEP);
  },
};

export default sepController;
