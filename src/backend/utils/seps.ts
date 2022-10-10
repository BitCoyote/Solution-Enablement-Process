import { Op, Transaction } from 'sequelize';
import { DataFieldWithOptionsAndLocationsAndKnockoutFollowupTasks } from '../../shared/types/DataField';
import { KnockoutFollowupType } from '../../shared/types/Knockout';
import { SEPPhase } from '../../shared/types/SEP';
import {
  TaskPhase,
  TaskStatus,
  ValidTaskDependencyStatus,
} from '../../shared/types/Task';
import Database from '../models';
import { getDefaultEnabledTasks, getKnockoutScreenList } from './knockouts';

/** Handles updating the sep phases and tasks as a SEP progresses. Should be called several places throughout the application to keep the SEP details up-to-date.  */
export const updateSEPProgress = async (
  db: Database,
  sepID: number,
  /** The ids of the tasks that have been updated. Status and phase updates will be checked against this list of tasks */
  affectedTaskIDs: number[],
  transaction: Transaction | null = null
) => {
  const sep = (await db.SEP.findByPk(sepID, {
    include: [
      {
        model: db.Task,
        as: 'tasks',
        required: false,
        where: {
          id: { [Op.in]: affectedTaskIDs },
          [Op.or]: [{ deletedAt: null }, { deletedAt: { [Op.ne]: null } }],
        },
        include: [
          {
            model: db.Task,
            as: 'dependentTasks',
            required: false,
            // We only need to update dependent tasks if they are in "pending" status
            where: { status: TaskStatus.pending },
            through: { attributes: ['id', 'status'] },
            include: [
              {
                model: db.Task,
                as: 'parentTasks',
                required: false,
                through: { attributes: ['id', 'status'] },
                // Dependencies are only counted if the parent task is enabled
                where: { enabled: true },
              },
            ],
          },
        ],
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
    transaction,
  })) as any;
  if (sep) {
    if (sep.phase === SEPPhase.knockout) {
      // SEP is in the knockout phase. Check if all knockout screens are complete.
      const knockoutScreenList = await getKnockoutScreenList(db, sepID);
      if (knockoutScreenList[knockoutScreenList.length - 1].complete) {
        // All knockout screens are complete.
        // Enable all default tasks (based on knockout answers)
        const dataFields = sep.getDataValue('dataFields').map((df: any) => ({
          ...df,
          knockoutTaskFollowups: df.knockoutFollowups,
        })) as DataFieldWithOptionsAndLocationsAndKnockoutFollowupTasks[];
        const defaultTaskIDs = getDefaultEnabledTasks(dataFields);
        if (defaultTaskIDs.length > 0) {
          await db.Task.update(
            { enabled: true },
            { where: { id: { [Op.in]: defaultTaskIDs } }, transaction }
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
              transaction,
            })
          )
            .filter((t: any) => t.parentTasks.length === 0)
            .map((t) => t.id);
          if (tasksToSetToTodo.length > 0) {
            await db.Task.update(
              { status: TaskStatus.todo },
              { where: { id: { [Op.in]: tasksToSetToTodo } }, transaction }
            );
          }
        }
        // All knockout screens are completed, move to initiate phase.
        await sep.update({ phase: SEPPhase.initiate }, { transaction });
      }
    } else if (
      sep.phase === SEPPhase.initiate ||
      sep.phase === SEPPhase.design ||
      sep.phase === SEPPhase.implement
    ) {
      const currentPhaseEnabledIncompleteTasks = await db.Task.findAll({
        where: {
          phase: sep.phase,
          sepID: sep.id,
          enabled: true,
          status: { [Op.ne]: TaskStatus.complete },
        },
      });
      if (currentPhaseEnabledIncompleteTasks.length === 0) {
        // All enabled tasks for this phase are complete! Let's lock the tasks and update the SEP Phase
        await db.Task.update(
          { locked: true },
          { where: { sepID: sepID, phase: sep.phase }, transaction }
        );

        const phases: (TaskPhase | SEPPhase)[] = [
          TaskPhase.initiate,
          TaskPhase.design,
          TaskPhase.implement,
          SEPPhase.complete,
        ];
        const newPhase = phases[phases.findIndex((p) => p === sep.phase) + 1];
        await db.SEP.update(
          { phase: newPhase },
          { where: { id: sepID }, transaction }
        );
      }
      // Check if any dependent tasks can be moved from "pending" to "todo"
      // TaskDependency.status works like an "at-least" hierarchy. So if TaskDependency.status === 'inReview', that means that the dependency is fulfilled if the parent task is in "inReview" or "complete" status.
      const statusHierarchy = {
        [TaskStatus.pending]: 0, // not a valid task dependency status
        [TaskStatus.todo]: 0, // not a valid task dependency status
        [TaskStatus.changesRequested]: 0, // not a valid task dependency status
        [ValidTaskDependencyStatus.inReview]: 1,
        [ValidTaskDependencyStatus.complete]: 2,
      };
      // sep.tasks is the already filtered by the given affectedTaskIDs from the above database query
      for (let i = 0; i < sep.tasks.length; i++) {
        const affectedTask = sep.tasks[i];
        for (let j = 0; j < affectedTask.dependentTasks.length; j++) {
          // Go through every dependent task of every affectedTask
          const dependentTask = affectedTask.dependentTasks[j];
          // If all dependencies are fulfilled, move the task to "todo" status!
          let dependenciesFulfilled = true;
          for (let k = 0; k < dependentTask.parentTasks.length; k++) {
            const parentTask = dependentTask.parentTasks[k];
            const taskDependencyStatus = parentTask.TaskDependency
              .status as TaskStatus;
            if (
              statusHierarchy[parentTask.status as TaskStatus] <
              statusHierarchy[taskDependencyStatus]
            ) {
              dependenciesFulfilled = false;
              break;
            }
          }
          if (dependenciesFulfilled) {
            await dependentTask.update(
              { status: TaskStatus.todo },
              { transaction }
            );
          }
        }
      }
    }
  }
};
