import { Op } from 'sequelize';
import { DataFieldWithOptionsAndKnockoutFollowupTasks } from '../../shared/types/DataField';
import { KnockoutFollowupType } from '../../shared/types/Knockout';
import { SEPPhase } from '../../shared/types/SEP';
import { Task, TaskPhase, TaskStatus } from '../../shared/types/Task';
import Database from '../models';
import { getDefaultEnabledTasks, getKnockoutScreenList } from './knockouts';

export const updateSEPPhaseAndTasks = async (db: Database, sepID: number) => {
  const sep = await db.SEP.findByPk(sepID, {
    include: [
      {
        model: db.Task,
        as: 'tasks',
        required: false,
      },
      {
        model: db.DataField,
        as: 'dataFields',
        required: false,
        include: [
          {
            model: db.DataFieldOption,
            as: 'dataFieldOptions',
            required: false,
          },
          {
            model: db.KnockoutFollowup,
            as: 'knockoutFollowups',
            required: false,
            where: {
              followupType: KnockoutFollowupType.Task,
            },
          },
        ],
      },
    ],
  });
  if (sep) {
    if (sep.phase === SEPPhase.knockout) {
      // SEP is in the knockout phase. Check if all knockout screens are complete.
      const knockoutScreenList = await getKnockoutScreenList(db, sepID);
      if (knockoutScreenList[knockoutScreenList.length - 1].complete) {
        // All knockout screens are complete.
        // Update sep phase to "initiate"
        await sep.update({ phase: SEPPhase.initiate });

        // Enable all default tasks (based on knockout answers)
        const dataFields = sep
          .getDataValue('dataFields')
          .map((df: any) => ({
            ...df,
            knockoutTaskFollowups: df.knockoutFollowups,
          })) as DataFieldWithOptionsAndKnockoutFollowupTasks[];
        const defaultTaskIDs = getDefaultEnabledTasks(dataFields);
        await db.Task.update(
          { enabled: true },
          { where: { id: { [Op.in]: defaultTaskIDs } } }
        );
        // Set all default tasks with no parent tasks to "todo" status
        const tasksToSetToTodo = (
          await db.Task.findAll({
            where: {
              sepID,
              id: { [Op.in]: defaultTaskIDs },
            },
            include: [
              {
                model: db.Task,
                as: 'parentTasks',
                through: { attributes: [] },
                required: false,
                where: {
                  enabled: true,
                },
              },
            ],
          })
        )
          .filter((t: any) => t.parentTasks.length === 0)
          .map((t) => t.id);
        await db.Task.update(
          { status: TaskStatus.todo },
          { where: { id: { [Op.in]: tasksToSetToTodo } } }
        );
      }
    } else if (
      sep.phase === SEPPhase.initiate &&
      !sep
        .getDataValue('tasks')
        .find(
          (t: Task) =>
            t.enabled &&
            t.phase === TaskPhase.initiate &&
            t.status !== TaskStatus.complete
        )
    ) {
      // All initiate tasks complete, move to design phase.
      sep.update({ phase: SEPPhase.design });
    } else if (
      sep.phase === SEPPhase.design &&
      !sep
        .getDataValue('tasks')
        .find(
          (t: Task) =>
            t.enabled &&
            t.phase === TaskPhase.design &&
            t.status !== TaskStatus.complete
        )
    ) {
      // All design tasks complete, move to implement phase.
      sep.update({ phase: SEPPhase.implement });
    } else if (
      sep.phase === SEPPhase.implement &&
      !sep
        .getDataValue('tasks')
        .find(
          (t: Task) =>
            t.enabled &&
            t.phase === TaskPhase.implement &&
            t.status !== TaskStatus.complete
        )
    ) {
      // All implement tasks complete, move to complete phase.
      sep.update({ phase: SEPPhase.complete });
    }
  }
};
