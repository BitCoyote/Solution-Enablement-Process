import { DataFieldWithOptions } from './DataField';
import { SequelizeTimestamps } from './Sequelize';

export enum KnockoutFollowupType {
  'KnockoutScreen' = 'KnockoutScreen',
  'Task' = 'Task',
}

export interface KnockoutScreen extends SequelizeTimestamps {
  id: number;
  name: string;
  description?: string;
  starter?: boolean;
  knockoutScreenTemplateID?: number;
  sepID: number;
}

export interface KnockoutFollowup extends SequelizeTimestamps {
  id: number;
  value: string;
  dataFieldID: number;
  followupID: number;
  followupType: KnockoutFollowupType;
  knockoutFollowupTemplateID?: number;
  sepID: number;
}

/** KnockoutFollup with type === 'KnockoutScreen' */
export interface KnockoutScreenFollowup extends KnockoutFollowup {
  followupType: KnockoutFollowupType.KnockoutScreen;
}

/** KnockoutFollup with type === 'Task' */
export interface KnockoutTaskFollowup extends KnockoutFollowup {
  followupType: KnockoutFollowupType.Task;
}

export interface KnockoutScreenTemplate {
  id: number;
  name: string;
  description?: string;
  starter?: boolean;
}

export interface KnockoutFollowupTemplate {
  id: number;
  value: string | number | boolean;
  dataFieldTemplateID: number;
  followupType: KnockoutFollowupType;
  followupID: number;
}

export interface KnockoutScreenWithDataFields extends KnockoutScreen {
  dataFields: DataFieldWithOptions[];
}
export interface KnockoutScreenWithCompletion
  extends KnockoutScreenWithDataFields {
  dataFields: DataFieldWithOptions[];
  complete: boolean;
}
