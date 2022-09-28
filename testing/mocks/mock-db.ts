import { User } from "../../src/shared/types/User";
import Database from "../../src/backend/models";
import { SEP, SEPPhase } from "../../src/shared/types/SEP";
import { Department, DepartmentID } from "../../src/shared/types/Department";
import { Task, TaskPhase, TaskStatus } from "../../src/shared/types/Task";
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
      ...baseObject, id: 1, name: 'Fantastic SEP', phase: SEPPhase.initiate, createdBy: 'abc'
    },
    {
      ...baseObject, id: 2, name: 'Incredible SEP', phase: SEPPhase.design, createdBy: 'system'
    },
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
      enabled: true,
      name: 'Super great task'
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
    }
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

