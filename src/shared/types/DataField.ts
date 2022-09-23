import { DepartmentID } from './Department';
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

export interface DataFieldValue extends SequelizeTimestamps {
  id: number;
  createdBy: string;
  value: string | number;
  dataFieldID: number;
  dataFieldTemplateID?: number;
}

export interface DataField extends SequelizeTimestamps {
  id: number;
  createdBy: string;
  name: string;
  description?: string;
  type: DataFieldType;
  sepID: number;
  dataFieldTemplateID?: number;
  value?: string;
  knockoutScreenID?: number;
  taskID?: number;
  departmentID?: DepartmentID;
  reviewTab: boolean;
  required: boolean;
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

export interface DataFieldAnswerBody {
  dataFieldTemplateID: number;
  values: string[];
}

export interface DataFieldWithValues extends DataField {
  dataFieldValues: DataFieldValue[];
}
