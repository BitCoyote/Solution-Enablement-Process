import { Sequelize } from 'sequelize/types';
import { initUser, UserModel } from './user.model';
import { initSEP, SEPModel, sepAssociations } from './sep.model';
import {
  initUserKnockoutAnswer,
  UserKnockoutAnswerModel,
  userKnockoutAnswerAssociations,
} from './user-knockout-answer.model';
import { initDepartment, DepartmentModel } from './department.model';
import {
  initDepartmentContact,
  DepartmentContactModel,
  departmentContactAssociations,
} from './department-contact.model';
import { initTask, TaskModel, taskAssociations } from './task.model';
import {
  initTaskDependency,
  TaskDependencyModel,
} from './task-dependency.model';
import {
  initAttachment,
  AttachmentModel,
  attachmentAssociations,
} from './attachment.model';
import {
  initComment,
  CommentModel,
  commentAssociations,
} from './comment.model';
import {
  initActivity,
  ActivityModel,
  activityAssociations,
} from './activity.model';

export default class Database {
  public User: typeof UserModel;
  public SEP: typeof SEPModel;
  public UserKnockoutAnswer: typeof UserKnockoutAnswerModel;
  public Department: typeof DepartmentModel;
  public DepartmentContact: typeof DepartmentContactModel;
  public Task: typeof TaskModel;
  public TaskDependency: typeof TaskDependencyModel;
  public Attachment: typeof AttachmentModel;
  public Comment: typeof CommentModel;
  public Activity: typeof ActivityModel;
  public sequelize: Sequelize;
  constructor(db: Sequelize) {
    // Initialize sequelize models
    this.User = initUser(db);
    this.SEP = initSEP(db);
    this.UserKnockoutAnswer = initUserKnockoutAnswer(db);
    this.Department = initDepartment(db);
    this.DepartmentContact = initDepartmentContact(db);
    this.Task = initTask(db);
    this.TaskDependency = initTaskDependency(db);
    this.Attachment = initAttachment(db);
    this.Comment = initComment(db);
    this.Activity = initActivity(db);
    this.sequelize = db;
    // Setup table assocations (must occur after all models are initialized)
    sepAssociations(this);
    userKnockoutAnswerAssociations(this);
    departmentContactAssociations(this);
    taskAssociations(this);
    attachmentAssociations(this);
    commentAssociations(this);
    activityAssociations(this);
  }
}
