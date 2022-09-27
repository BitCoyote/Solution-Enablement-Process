import { SEPPhase } from '../../shared/types/SEP';
import { Task, TaskPhase, TaskStatus } from '../../shared/types/Task';
import Database from '../models';
import { getKnockoutScreenList } from './knockouts';

export const updateSEPPhase = async (db: Database, sepID: number) => {
  const sep = await db.SEP.findByPk(sepID, {
    include: [
      {
        model: db.Task,
        as: 'tasks',
        where: {
          enabled: true,
        },
      },
    ],
  });
  if (sep) {
    if (sep.phase === SEPPhase.knockout) {
      // SEP is in the knockout phase. Check if all knockout screens are complete.
      const knockoutScreenList = await getKnockoutScreenList(db, sepID);
      if (knockoutScreenList[knockoutScreenList.length - 1].complete) {
        sep.update({ phase: SEPPhase.initiate });
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
