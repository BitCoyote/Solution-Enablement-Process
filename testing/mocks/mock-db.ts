import { User } from "../../src/shared/types/User";
import Database from "../../src/backend/models";
import { SEP, SEPPhase } from "../../src/shared/types/SEP";
import { Department, DepartmentID } from "../../src/shared/types/Department";
import { Task, TaskDependency, TaskPhase, TaskStatus } from "../../src/shared/types/Task";
import { DataField, DataFieldOption, DataFieldType } from "../../src/shared/types/DataField";
import { KnockoutFollowup, KnockoutFollowupType, KnockoutScreen } from "../../src/shared/types/Knockout";
const testUserID = '774d6f78-5477-4f71-8f6e-fea599577a50';

const baseObject = {
  createdAt: '2022-09-13 19:13:31.5850000 +00:00',
  updatedAt: '2022-09-13 19:13:31.5850000 +00:00'
};
// This file acts as a fixture for mock data inserted into the database to be used for automated testing.
interface TestData {
  User: User[],
  SEP: SEP[],
  Department: Department[],
  Task: Task[],
  TaskDependency: TaskDependency[],
  DataField: DataField[],
  DataFieldOption: DataFieldOption[],
  KnockoutScreen: KnockoutScreen[],
  KnockoutFollowup: KnockoutFollowup[],
}

/** Mock data to be inserted into testing database. 
 * The order these tables are defined in is the order they will be inserted into the database. 
 * */
export const testData: TestData = {
  User: [
    { ...baseObject, id: 'system', displayName: 'System User' },
    { ...baseObject, id: testUserID, displayName: 'Test User' },
    { ...baseObject, id: 'abc', displayName: 'ABC User' }
  ],
  SEP: [
    {
      ...baseObject, id: 1, name: 'Fantastic SEP', phase: SEPPhase.initiate, createdBy: 'abc', locked: false,
    },
    {
      ...baseObject, id: 2, name: 'Incredible SEP', phase: SEPPhase.design, createdBy: 'system', locked: false,
    },
    {
      ...baseObject, id: 3, name: 'SEP to test phase and task update flow', phase: SEPPhase.knockout, createdBy: 'system', locked: false,
    }
  ],
  Department: [
    { ...baseObject, id: DepartmentID.legal },
    { ...baseObject, id: DepartmentID.ea },
    { ...baseObject, id: DepartmentID.sec },
    { ...baseObject, id: DepartmentID.tps },
    { ...baseObject, id: DepartmentID.ncs },
    { ...baseObject, id: DepartmentID.supply },
    { ...baseObject, id: DepartmentID.po },
    { ...baseObject, id: DepartmentID.sa },
  ],
  Task: [
    {
      ...baseObject,
      id: 1,
      phase: TaskPhase.initiate,
      status: TaskStatus.todo,
      departmentID: DepartmentID.sa,
      createdBy: 'system',
      sepID: 1,
      review: true,
      enabled: true,
      locked: false,
      name: 'Really great task'
    },
    {
      ...baseObject,
      id: 2,
      phase: TaskPhase.design,
      status: TaskStatus.todo,
      departmentID: DepartmentID.sa,
      createdBy: 'system',
      sepID: 2,
      review: true,
      locked: false,
      enabled: true,
      name: 'Super great task'
    },
    {
      ...baseObject,
      id: 3,
      phase: TaskPhase.design,
      status: TaskStatus.pending,
      departmentID: DepartmentID.sa,
      createdBy: 'system',
      sepID: 3,
      review: true,
      enabled: false,
      locked: false,
      name: 'A task to be enabled by answering a knockout question'
    },
    {
      ...baseObject,
      id: 4,
      phase: TaskPhase.initiate,
      status: TaskStatus.pending,
      departmentID: DepartmentID.sa,
      createdBy: 'system',
      assignedUserID: testUserID,
      sepID: 3,
      review: true,
      locked: false,
      enabled: true,
      name: 'A task that has a parent task'
    },
    {
      ...baseObject,
      id: 5,
      phase: TaskPhase.initiate,
      status: TaskStatus.pending,
      departmentID: DepartmentID.sa,
      createdBy: 'system',
      sepID: 3,
      review: true,
      defaultReviewerID: 'abc',
      locked: false,
      enabled: true,
      name: 'A parent task for task 4'
    }
  ],
  TaskDependency: [
    {
      ...baseObject,
      id: 1,
      taskID: 5,
      dependentTaskID: 4,
      status: TaskStatus.complete
    }
  ],
  KnockoutScreen: [
    {
      ...baseObject,
      id: 1,
      sepID: 1,
      name: 'Screen 1',
      starter: true
    },
    {
      ...baseObject,
      id: 2,
      sepID: 1,
      name: 'Screen 2',
      starter: true
    },
    {
      ...baseObject,
      id: 3,
      sepID: 1,
      name: 'Screen 3',
      starter: false
    },
    {
      ...baseObject,
      id: 4,
      sepID: 3,
      name: 'The only screen for SEP 3 to test knockout flow',
      starter: true
    },
  ],
  DataField: [
    {
      ...baseObject,
      id: 1,
      createdBy: 'system',
      name: 'Blorg',
      type: DataFieldType.select,
      sepID: 1,
      reviewTab: false,
      required: true,
      knockoutScreenID: 1
    },
    {
      ...baseObject,
      id: 2,
      createdBy: 'system',
      name: 'Blorg',
      type: DataFieldType.input,
      sepID: 1,
      reviewTab: false,
      required: true,
      knockoutScreenID: 2
    },
    {
      ...baseObject,
      id: 3,
      createdBy: 'system',
      name: 'Blorg',
      type: DataFieldType.input,
      sepID: 1,
      reviewTab: false,
      required: true,
      knockoutScreenID: 3
    },
    {
      ...baseObject,
      id: 4,
      createdBy: 'system',
      name: 'The only data input for SEP 3 to test knockout flow',
      type: DataFieldType.input,
      sepID: 3,
      reviewTab: false,
      required: true,
      knockoutScreenID: 4
    },
  ],
  DataFieldOption: [
    {
      ...baseObject,
      id: 1,
      value: 'A',
      selected: false,
      dataFieldID: 1,
      sepID: 1,
    },
    {
      ...baseObject,
      id: 2,
      value: 'B',
      selected: false,
      dataFieldID: 1,
      sepID: 1,
    },
  ],
  KnockoutFollowup: [
    {
      ...baseObject,
      id: 1,
      value: 'A',
      dataFieldID: 1,
      followupID: 3,
      followupType: KnockoutFollowupType.KnockoutScreen,
      sepID: 1,
    },
    {
      ...baseObject,
      id: 2,
      value: 'Hello',
      dataFieldID: 4,
      followupID: 3,
      followupType: KnockoutFollowupType.Task,
      sepID: 3,
    },
  ],
};

export const seedTables = async (db: Database) => {
  await db.sequelize.transaction(async (t) => {
    for (const prop in testData) {
      //@ts-ignore
      await db[prop].bulkCreate(testData[prop], { transaction: t });
    }
  });
}

