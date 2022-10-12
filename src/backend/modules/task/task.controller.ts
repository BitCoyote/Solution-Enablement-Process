import express from 'express';
import { CountOptions, FindOptions, Op, OrderItem } from 'sequelize';
import {
  CreateTaskBody,
  UpdateMultipleTaskBody,
  UpdateTaskBody,
  ValidTaskStatusUpdate,
} from '../../../shared/types/Task';
import Database from '../../models';
import { TaskModel } from '../../models/task.model';
import { updateSEPProgress } from '../../utils/seps';

const taskController = {
  searchTasks: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const limit = parseInt(req.query.limit as string) || 25;
    const offset = parseInt(req.query.offset as string) || 0;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortDirection = req.query.sortAsc === 'true' ? 'ASC' : 'DESC';
    let orderArray;
    if (sortBy.includes('assignee.')) {
      // sorting by a nested property
      const propName = sortBy.split('.')[1] as string;
      orderArray = [
        { model: db.User, as: 'assignee' },
        propName,
        sortDirection,
      ];
    } else if (sortBy.includes('defaultReviewer.')) {
      // sorting by a nested property
      const propName = sortBy.split('.')[1] as string;
      orderArray = [
        { model: db.User, as: 'defaultReviewer' },
        propName,
        sortDirection,
      ];
    } else if (sortBy.includes('sep.')) {
      // sorting by a nested property
      const propName = sortBy.split('.')[1] as string;
      orderArray = [{ model: db.SEP, as: 'sep' }, propName, sortDirection];
    } else {
      // sorting by a property on the Task object
      orderArray = [
        sortBy === 'dependentTaskCount' ? db.sequelize.literal(sortBy) : sortBy,
        sortDirection,
      ];
    }
    const search = req.query.search;
    const filters = req.query;
    const options: FindOptions = {
      subQuery: false,
      where: {}, // TODO: This will  be restricted to only show enabled:true after knockout question work is done. Leaving for now so frontend work on task list can begin
      limit,
      offset,
      order: [orderArray as unknown as OrderItem],
      group: [
        // sequelize.literal is necessary here for tests because sqlite uses ticks `` instead of square brackets []
        db.sequelize.literal(`[Task].[id]`) as unknown as string,
        db.sequelize.literal(`[Task].[createdAt]`) as unknown as string,
        db.sequelize.literal(`[Task].[updatedAt]`) as unknown as string,
        db.sequelize.literal(`[Task].[name]`) as unknown as string,
        db.sequelize.literal(`[Task].[departmentID]`) as unknown as string,
        db.sequelize.literal(`[Task].[phase]`) as unknown as string,
        db.sequelize.literal(`[Task].[status]`) as unknown as string,
        `assignee.id`,
        `assignee.displayName`,
        `assignee.email`,
        `defaultReviewer.id`,
        `defaultReviewer.displayName`,
        `defaultReviewer.email`,
        `sep.id`,
        `sep.name`,
        `sep.phase`,
      ],
      attributes: [
        `id`,
        `createdAt`,
        `updatedAt`,
        `name`,
        `phase`,
        `status`,
        `departmentID`,
        [
          db.sequelize.fn('COUNT', db.sequelize.col('TaskDependencies.taskID')),
          'dependentTaskCount',
        ],
      ],
      include: [
        {
          model: db.User,
          as: 'assignee',
          attributes: ['id', 'displayName', 'email'],
        },
        {
          model: db.User,
          as: 'defaultReviewer',
          attributes: ['id', 'displayName', 'email'],
        },
        {
          model: db.SEP,
          as: 'sep',
          attributes: ['id', 'name', 'phase'],
        },
        {
          model: db.TaskDependency,
          as: 'taskDependencies',
          attributes: [],
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
      let propToUse: any = prop;
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
        'departmentID',
        'name',
        'phase',
        'status',
        '$dependentTaskCount$',
        '$sep.id$',
        '$sep.name$',
        '$sep.phase$',
        '$assignee.id$',
        '$assignee.email$',
        '$assignee.displayName$',
        '$defaultReviewer.id$',
        '$defaultReviewer.email$',
        '$defaultReviewer.displayName$',
      ];
      /** The searchable fields that need to be converted to numbers before being searched */
      const convertToNumber = [
        'id',
        '$dependentTaskCount$',
        '$sep.id$',
        'departmentID',
      ];
      (options.where as any)[Op.or] = searchableFields
        .map((searchableField) => ({
          [searchableField]: {
            [Op.like]: convertToNumber.includes(searchableField)
              ? parseInt(search as string)
              : `%${search as string}%`,
          },
        }))
        // filter out invalid (null, NaN, undefined) values
        .filter((a, idx) => a[searchableFields[idx]][Op.like]);
    }
    const tasks = await db.Task.findAll(options);
    const countOpts = { ...options } as CountOptions;
    delete countOpts.attributes;
    delete countOpts.group;
    countOpts.distinct = true;
    const count = await db.Task.count(countOpts);
    return res.send({ count, tasks });
  },
  updateTaskStatus: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    // checkForValidTaskStatusUpdate middleware has already validated that this is a valid task status transition
    await db.sequelize.transaction(async (transaction) => {
      const id = parseInt(req.params.id);
      const newStatus = req.body.status as ValidTaskStatusUpdate;
      const task = (await db.Task.findByPk(id, {
        include: [
          {
            model: db.SEP,
            as: 'sep',
          },
        ],
      })) as any;
      // Reassign task to correct user based on status
      let newAssignee;
      if (
        newStatus === ValidTaskStatusUpdate.inReview &&
        task.defaultReviewerID
      ) {
        // When sent to "inReview" status, assign task to the default reviewer
        newAssignee = task.defaultReviewerID;
      } else if (
        newStatus === ValidTaskStatusUpdate.todo ||
        newStatus === ValidTaskStatusUpdate.changesRequested
      ) {
        // When sent to "todo" or "changesRequested" status, assign task to the sep creator (requestor)
        newAssignee = task.sep.createdBy;
      }
      const updateBody: any = { status: newStatus };
      if (newAssignee) {
        updateBody.assignedUserID = newAssignee;
      }
      // Update task status
      await task.update(updateBody, { transaction });
      await updateSEPProgress(db, task.sepID, [task.id], transaction);
    });

    return res.send();
  },
  updateTask: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    // roles middleware has already validated that the user has the proper permissions to make this update
    const task = await db.sequelize.transaction(async (transaction) => {
      const id = parseInt(req.params.id);
      const task = (await db.Task.findByPk(id)) as any;
      // Update task
      const updateBody: UpdateTaskBody = {
        enabled: req.body.enabled ?? task.enabled,
        review: req.body.enabled ?? task.review,
        name: req.body.name ?? task.name,
        description: req.body.description ?? task.description,
        assignedUserID: req.body.assignedUserID ?? task.assignedUserID,
        defaultReviewerID: req.body.defaultReviewerID ?? task.defaultReviewerID,
        phase: req.body.phase ?? task.phase,
      };
      await task.update(updateBody, { transaction });
      await updateSEPProgress(db, task.sepID, [task.id], transaction);
      return task;
    });

    return res.send(task);
  },
  updateMultipleTasks: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const tasks = req.body as UpdateMultipleTaskBody[];
    // roles middleware has already validated that the user has the proper permissions to make this update
    await db.sequelize.transaction(async (transaction) => {
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const updateBody: UpdateTaskBody = {
          enabled: req.body.enabled ?? task.enabled,
          review: req.body.enabled ?? task.review,
          name: req.body.name ?? task.name,
          description: req.body.description ?? task.description,
          assignedUserID: req.body.assignedUserID ?? task.assignedUserID,
          defaultReviewerID:
            req.body.defaultReviewerID ?? task.defaultReviewerID,
          phase: req.body.phase ?? task.phase,
        };
        await db.Task.update(updateBody, {
          where: { sepID: req.params.sepID, id: task.id },
          transaction,
        });
      }
      await updateSEPProgress(
        db,
        req.body.sepID,
        tasks.map((t) => t.id),
        transaction
      );
    });

    return res.send();
  },
  getTasksBySEPID: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const sepID = parseInt(req.params.sepID);
    const tasks = await db.Task.findAll({
      where: { sepID },
      include: [
        {
          model: db.Task,
          as: 'parentTasks',
          through: { attributes: [] },
        },
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
      ],
    });
    return res.send(tasks);
  },
  createTask: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const taskToCreate = req.body as CreateTaskBody;
    const sep = await db.SEP.findByPk(taskToCreate.sepID);
    const task = await db.Task.create({
      ...taskToCreate,
      enabled: taskToCreate.enabled || true,
      review: taskToCreate.review || true,
      assignedUserID: taskToCreate.assignedUserID ?? sep?.createdBy,
      createdBy: res.locals.user.oid,
      locked: false,
      status: 'todo',
    });
    return res.send(task);
  },
  deleteTask: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    // The task model has paranoid: true so this will perform a soft-deleted using the "deletedAt" column
    await db.sequelize.transaction(async (transaction) => {
      const task = (await db.Task.findByPk(
        parseInt(req.params.id)
      )) as TaskModel;
      await task.destroy({ transaction });
      await updateSEPProgress(db, task.sepID, [task.id], transaction);
    });
    return res.send();
  },
};

export default taskController;
