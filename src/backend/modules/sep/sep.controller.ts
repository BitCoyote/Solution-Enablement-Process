import express from 'express';
import { Op, OrderItem } from 'sequelize';
import { FindAndCountOptions } from 'sequelize/types';
import { DataFieldLocationType } from '../../../shared/types/DataField';
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
  dataFieldLocationTemplates,
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
      const newSEP = await db.SEP.create(
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
          status: TaskStatus.pending,
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
          sepID: newSEP.id,
          value: null,
          dataFieldTemplateID: dataFieldTemplate.id,
          icon: dataFieldTemplate.icon,
        })),
        { transaction }
      );
      /** Get the id for the newly created location */
      const getLocationID = (
        locationType: DataFieldLocationType,
        templateID: number
      ) => {
        if (
          locationType === DataFieldLocationType.Department ||
          locationType === DataFieldLocationType.DepartmentReview
        ) {
          return templateID;
        } else if (locationType === DataFieldLocationType.KnockoutScreen) {
          return knockoutScreens.find(
            (k) => k.knockoutScreenTemplateID === templateID
          )?.id;
        } else if (locationType === DataFieldLocationType.Task) {
          return tasks.find((t) => t.taskTemplateID === templateID)?.id;
        }
      };
      // Create DataFieldLocations
      await db.DataFieldLocation.bulkCreate(
        dataFieldLocationTemplates.map((dataFieldLocationTemplate) => ({
          dataFieldID: dataFields.find(
            (d) =>
              d.dataFieldTemplateID ===
              dataFieldLocationTemplate.dataFieldTemplateID
          )?.id,
          sepID: newSEP.id,
          locationID: getLocationID(
            dataFieldLocationTemplate.locationType,
            dataFieldLocationTemplate.locationID
          ),
          locationType: dataFieldLocationTemplate.locationType,
          required: dataFieldLocationTemplate.required || false,
          readOnly: dataFieldLocationTemplate.readOnly || false,
          dataFieldLocationTemplateID: dataFieldLocationTemplate.id,
        })),
        { transaction, returning: [] }
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
          dataFieldOptionTemplateID: dataFieldOptionTemplate.id,
          description: dataFieldOptionTemplate.description,
          selected: dataFieldOptionTemplate.selected || false,
          icon: dataFieldOptionTemplate.icon,
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
  getSEPExtended: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const id = parseInt(req.params.id);
    const sep = await db.SEP.findOne({
      where: { id },
      include: [
        {
          model: db.User,
          as: 'creator',
          attributes: ['id', 'email', 'displayName'],
        },
        {
          model: db.Task,
          as: 'tasks',
          include: [
            {
              model: db.User,
              as: 'assignee',
              attributes: ['id', 'email', 'displayName'],
            },
            {
              model: db.User,
              as: 'defaultReviewer',
              attributes: ['id', 'email', 'displayName'],
            },
            {
              model: db.Task,
              as: 'parentTasks',
            },
          ],
        },
        {
          model: db.Comment,
          as: 'comments',
          include: [
            {
              model: db.User,
              as: 'creator',
              attributes: ['id', 'email', 'displayName'],
            },
            {
              model: db.Comment,
              as: 'replyComment',
              include: [
                {
                  model: db.User,
                  as: 'creator',
                  attributes: ['id', 'email', 'displayName'],
                },
              ],
            },
          ],
        },
        {
          model: db.Activity,
          as: 'activities',
        },
        {
          model: db.Attachment,
          as: 'attachments',
        },
        {
          model: db.DataField,
          as: 'dataFields',
          include: [
            {
              model: db.DataFieldOption,
              as: 'dataFieldOptions',
            },
            {
              model: db.DataFieldLocation,
              as: 'dataFieldLocations',
            },
          ],
        },
      ],
    });
    if (!sep) {
      return res.status(404).send('Cannot find SEP.');
    }
    return res.send(sep);
  },
  getSEP: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const id = parseInt(req.params.id);
    const sep = await db.SEP.findOne({
      where: { id },
      include: [
        {
          model: db.User,
          as: 'creator',
          attributes: ['id', 'email', 'displayName'],
        },
      ],
    });
    if (!sep) {
      return res.status(404).send('Cannot find SEP.');
    }
    return res.send(sep);
  },
};

export default sepController;
