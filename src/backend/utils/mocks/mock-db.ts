import { Permission } from "../../../shared/types/Permission";
import { Role, RolePermission } from "../../../shared/types/Role";
import { User, UserRole } from "../../../shared/types/User";
import Database from "../../models";
const testUserID = '774d6f78-5477-4f71-8f6e-fea599577a50';

const baseObject = {
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'system'
};
// This file acts as a fixture for mock data inserted into the database to be used for automated testing.
interface TestData {
  User: User[]
  Role: Role[]
  Permission: Permission[]
  RolePermission: RolePermission[]
  UserRole: UserRole[]
}

/** Mock data to be inserted into testing database. 
 * The order these tables are defined in is the order they will be inserted into the database. 
 * */
export const testData: TestData = {
  User: [
    { ...baseObject, id: 'system' },
    { ...baseObject, id: testUserID },
    { ...baseObject, id: 'abc' }
  ],
  Role: [
    { ...baseObject, id: 1, name: 'System Admin', superUser: true, description: 'Can do anything!' }
  ],
  Permission: [
    { ...baseObject, id: 'GO_SURFING', name: 'Surfing', description: 'This user can go surfing.' }
  ],
  RolePermission: [
    { ...baseObject, roleID: 1, permissionID: 'GO_SURFING' }
  ],
  UserRole: [
    { ...baseObject, userID: testUserID, roleID: 1 }
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

