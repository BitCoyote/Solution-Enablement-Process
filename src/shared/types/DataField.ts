import { DepartmentID } from './Department';
import { KnockoutTaskFollowup } from './Knockout';
import { SequelizeTimestamps } from './Sequelize';

export enum DataFieldType {
  input = 'input',
  textarea = 'textarea',
  number = 'number',
  email = 'email',
  select = 'select',
  multiSelect = 'multiSelect',
  date = 'date',
  dateTime = 'dateTime',
  yesNo = 'yesNo',
  checkbox = 'checkbox',
  toggle = 'toggle',
  apmID = 'apmID',
}

export interface DataField extends SequelizeTimestamps {
  id: number;
  createdBy: string;
  name: string;
  description?: string;
  type: DataFieldType;
  sepID: number;
  dataFieldTemplateID?: number;
  value?: string | number | boolean;
  knockoutScreenID?: number;
  taskID?: number;
  departmentID?: DepartmentID;
  reviewTab: boolean;
  required: boolean;
}

export interface DataFieldWithOptions extends DataField {
  dataFieldOptions: DataFieldOption[];
}

export interface DataFieldWithOptionsAndKnockoutFollowupTasks
  extends DataFieldWithOptions {
  knockoutTaskFollowups: KnockoutTaskFollowup[];
}

export interface DataFieldOption extends SequelizeTimestamps {
  id: number;
  value: string;
  selected: boolean;
  dataFieldID: number;
  dataFieldOptionTemplateID?: number;
  sepID: number;
  description?: string;
}

export interface DataFieldOptionTemplate {
  id: number;
  value: string;
  dataFieldTemplateID: number;
  selected?: boolean;
  description?: string;
}

export interface DataFieldTemplate {
  id: number;
  name: string;
  description?: string;
  type: DataFieldType;
  knockoutScreenTemplateID?: number;
  taskTemplateID?: number;
  departmentID?: DepartmentID;
  reviewTab?: boolean;
  required: boolean;
}
export interface DataFieldOptionUpdate {
  /** The DataFieldOption id */
  id: number;
  selected: boolean;
}
export interface DataFieldUpdate {
  /** The DataField id */
  id: number;
  /** Leave undefined for select/multi-select fields */
  value?: string | number | boolean;
  dataFieldOptions?: DataFieldOptionUpdate[];
}
