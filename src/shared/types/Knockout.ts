import { DataField } from './DataField';
import { SequelizeTimestamps } from './Sequelize';

export enum KnockoutFollowupTemplateType {
  'KnockoutScreenTemplate' = 'KnockoutScreenTemplate',
  'TaskTemplate' = 'TaskTemplate',
}
export enum KnockoutFollowupType {
  'KnockoutScreen' = 'KnockoutScreen',
  'TaskTemplate' = 'TaskTemplate',
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

export interface KnockoutScreenTemplate {
  id: number;
  name: string;
  description?: string;
  starter?: boolean;
}

export interface KnockoutFollowupTemplate {
  value: string;
  dataFieldTemplateID: number;
  followupType: KnockoutFollowupTemplateType;
  followupID: number;
}

export interface KnockoutScreenWithDataFields extends KnockoutScreen {
  dataFields: DataField[];
}
