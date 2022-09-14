import { Sequelize } from 'sequelize/types';
import { initUser, UserModel } from './user.model';
import { initSEP, SEPModel, sepAssociations } from './sep.model';
import {
  initUserKnockoutAnswer,
  UserKnockoutAnswerModel,
  userKnockoutAnswerAssociations,
} from './user-knockout-answer.model';
export default class Database {
  public User: typeof UserModel;
  public SEP: typeof SEPModel;
  public UserKnockoutAnswer: typeof UserKnockoutAnswerModel;
  public sequelize: Sequelize;
  constructor(db: Sequelize) {
    // Initialize sequelize models
    this.User = initUser(db);
    this.SEP = initSEP(db);
    this.UserKnockoutAnswer = initUserKnockoutAnswer(db);
    this.sequelize = db;
    // Setup table assocations (must occur after all models are initialized)
    sepAssociations(this);
    userKnockoutAnswerAssociations(this);
  }
}
