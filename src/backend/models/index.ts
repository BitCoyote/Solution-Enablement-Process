import { Sequelize } from 'sequelize/types';
import { initUser, userAssociations, UserModel } from './user.model';
import { initSEP, SEPModel, sepAssociations } from './sep.model';
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
import {
  initDataField,
  DataFieldModel,
  dataFieldAssociations,
} from './data-field.model';
import {
  initDataFieldOption,
  DataFieldOptionModel,
} from './data-field-option.model';
import {
  initKnockoutScreen,
  knockoutScreenAssociations,
  KnockoutScreenModel,
} from './knockout-screen.model';
import {
  initKnockoutFollowup,
  KnockoutFollowupModel,
} from './knockout-followup.model';

export default class Database {
  public User: typeof UserModel;
  public SEP: typeof SEPModel;
  public Department: typeof DepartmentModel;
  public DepartmentContact: typeof DepartmentContactModel;
  public Task: typeof TaskModel;
  public TaskDependency: typeof TaskDependencyModel;
  public Attachment: typeof AttachmentModel;
  public Comment: typeof CommentModel;
  public Activity: typeof ActivityModel;
  public DataField: typeof DataFieldModel;
  public DataFieldOption: typeof DataFieldOptionModel;
  public KnockoutScreen: typeof KnockoutScreenModel;
  public KnockoutFollowup: typeof KnockoutFollowupModel;
  public sequelize: Sequelize;
  constructor(db: Sequelize) {
    // Initialize sequelize models
    this.User = initUser(db);
    this.SEP = initSEP(db);
    this.Department = initDepartment(db);
    this.DepartmentContact = initDepartmentContact(db);
    this.Task = initTask(db);
    this.TaskDependency = initTaskDependency(db);
    this.Attachment = initAttachment(db);
    this.Comment = initComment(db);
    this.Activity = initActivity(db);
    this.DataField = initDataField(db);
    this.DataFieldOption = initDataFieldOption(db);
    this.KnockoutScreen = initKnockoutScreen(db);
    this.KnockoutFollowup = initKnockoutFollowup(db);
    this.sequelize = db;
    // Setup table assocations (must occur after all models are initialized)
    sepAssociations(this);
    departmentContactAssociations(this);
    taskAssociations(this);
    attachmentAssociations(this);
    commentAssociations(this);
    activityAssociations(this);
    dataFieldAssociations(this);
    userAssociations(this);
    knockoutScreenAssociations(this);
  }
}
