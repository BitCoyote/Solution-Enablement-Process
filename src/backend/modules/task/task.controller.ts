import express from 'express';
import { CountOptions, FindOptions, Op, OrderItem } from 'sequelize';
import Database from '../../models';
const taskController = {
  getTasks: async (
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
      const convertToNumber = ['id', '$dependentTaskCount$', '$sep.id$'];
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
};

export default taskController;
