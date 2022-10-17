import { User } from "../../src/shared/types/User";
import Database from "../../src/backend/models";
import { SEP, SEPPhase } from "../../src/shared/types/SEP";
import { Department, DepartmentID } from "../../src/shared/types/Department";
import { Task, TaskDependency, TaskPhase, TaskStatus, ValidTaskDependencyStatus } from "../../src/shared/types/Task";
import { Comment } from "../../src/shared/types/Comment";
import { DataField, DataFieldOption, DataFieldLocation, DataFieldType, DataFieldLocationType } from "../../src/shared/types/DataField";
import { KnockoutFollowup, KnockoutFollowupType, KnockoutScreen } from "../../src/shared/types/Knockout";
import { Attachment } from "../../src/shared/types/Attachment";
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
  DataFieldLocation: DataFieldLocation[],
  KnockoutScreen: KnockoutScreen[],
  KnockoutFollowup: KnockoutFollowup[],
  Comment: Comment[],
  Attachment: Attachment[]
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
      ...baseObject, id: 3, name: 'SEP to test phase and task update flow', phase: SEPPhase.implement, createdBy: 'system', locked: false,
    },
  ],
  Department: [
    { ...baseObject, id: DepartmentID.legal, name: 'Legal', adAppRole: 'AuthLegal' },
    { ...baseObject, id: DepartmentID.ea, name: 'EA', adAppRole: 'AuthEA' },
    { ...baseObject, id: DepartmentID.sec, name: 'Security', adAppRole: 'AuthSecurity' },
    { ...baseObject, id: DepartmentID.tps, name: 'Third Party Security', adAppRole: 'AuthThirdPartySecurity' },
    { ...baseObject, id: DepartmentID.ncs, name: 'Nuclear Cyber Security', adAppRole: 'AuthNuclearCyberSecurity' },
    { ...baseObject, id: DepartmentID.supply, name: 'Supply', adAppRole: 'AuthSupply' },
    { ...baseObject, id: DepartmentID.po, name: 'Portfolio Owner', adAppRole: 'AuthPortfolioOwner' },
    { ...baseObject, id: DepartmentID.sa, name: 'Solution Architect', adAppRole: 'AuthSolutionArchitect' },
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
      name: 'Really great task',
      shortName: 'taskerino'
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
      name: 'Super great task',
      shortName: 'taskerino'
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
      name: 'A task to be enabled by answering a knockout question',
      shortName: 'taskerino'
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
      name: 'A task that has a parent task',
      shortName: 'taskerino'
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
      name: 'A parent task for task 4',
      shortName: 'taskerino'
    }
  ],
  TaskDependency: [
    {
      ...baseObject,
      id: 1,
      taskID: 5,
      dependentTaskID: 4,
      status: ValidTaskDependencyStatus.complete
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
      sepID: 1
    },
    {
      ...baseObject,
      id: 2,
      createdBy: 'system',
      name: 'Blorg',
      type: DataFieldType.input,
      sepID: 1,
    },
    {
      ...baseObject,
      id: 3,
      createdBy: 'system',
      name: 'Blorg',
      type: DataFieldType.input,
      sepID: 1
    },
    {
      ...baseObject,
      id: 4,
      createdBy: 'system',
      name: 'The only data input for SEP 3 to test knockout flow',
      type: DataFieldType.input,
      sepID: 3
    },
  ],
  DataFieldLocation: [
    {
      ...baseObject,
      id: 1,
      sepID: 1,
      dataFieldID: 1,
      locationID: 1,
      locationType: DataFieldLocationType.KnockoutScreen,
      required: true,
      readOnly: false
    },
    {
      ...baseObject,
      id: 2,
      sepID: 1,
      dataFieldID: 2,
      locationID: 2,
      locationType: DataFieldLocationType.KnockoutScreen,
      required: true,
      readOnly: false
    },
    {
      ...baseObject,
      id: 3,
      sepID: 1,
      dataFieldID: 3,
      locationID: 3,
      locationType: DataFieldLocationType.KnockoutScreen,
      required: true,
      readOnly: false
    },
    {
      ...baseObject,
      id: 4,
      sepID: 1,
      dataFieldID: 4,
      locationID: 4,
      locationType: DataFieldLocationType.KnockoutScreen,
      required: true,
      readOnly: false
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
  Comment: [
    {
      ...baseObject,
      id: 1,
      createdBy: 'abc',
      sepID: 1,
      comment: 'Hello!',
      departmentID: DepartmentID.legal
    },
    {
      ...baseObject,
      id: 2,
      createdBy: testUserID,
      sepID: 1,
      comment: 'Hello!',
      replyCommentID: 1,
      departmentID: DepartmentID.legal
    },
  ],
  Attachment: [
    {
      ...baseObject,
      id: 1,
      createdBy: testUserID,
      name: 'Cool File Attachment',
      mimeType: 'image/png',
      sepID: 1
    },
    {
      ...baseObject,
      id: 2,
      createdBy: testUserID,
      name: 'Cool URL Attachment',
      url: 'https://google.com',
      sepID: 1
    }
  ]
};

export const seedTables = async (db: Database) => {
  await db.sequelize.transaction(async (t) => {
    for (const prop in testData) {
      //@ts-ignore
      await db[prop].bulkCreate(testData[prop], { transaction: t });
    }
  });
}

