import { Sequelize } from 'sequelize/types';
import { initUser, UserModel } from './user.model';
export default class Database {
  public User: typeof UserModel;
  public sequelize: Sequelize;
  constructor(db: Sequelize) {
    // Initialize sequelize models
    this.User = initUser(db);
    this.sequelize = db;
    // Setup table assocations (must occur after all models are initialized)
    // userAssociations(this);
  }
}
