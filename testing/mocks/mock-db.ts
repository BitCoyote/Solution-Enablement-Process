import { User } from "../../src/shared/types/User";
import Database from "../../src/backend/models";
const testUserID = '774d6f78-5477-4f71-8f6e-fea599577a50';

const baseObject = {
  createdAt: '2022-09-13 19:13:31.5850000 +00:00',
  updatedAt: '2022-09-13 19:13:31.5850000 +00:00',
  createdBy: 'system'
};
// This file acts as a fixture for mock data inserted into the database to be used for automated testing.
interface TestData {
  User: User[]
}

/** Mock data to be inserted into testing database. 
 * The order these tables are defined in is the order they will be inserted into the database. 
 * */
export const testData: TestData = {
  User: [
    { ...baseObject, id: 'system' },
    { ...baseObject, id: testUserID },
    { ...baseObject, id: 'abc' }
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

