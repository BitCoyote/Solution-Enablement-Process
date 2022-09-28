import { DataField } from './DataField';
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

export interface KnockoutScreenTemplate {
  id: number;
  name: string;
  description?: string;
  starter?: boolean;
}

export interface KnockoutFollowupTemplate {
  id: number;
  value: string;
  dataFieldTemplateID: number;
  followupType: KnockoutFollowupType;
  followupID: number;
}

export interface KnockoutScreenWithDataFields extends KnockoutScreen {
  dataFields: DataField[];
}
