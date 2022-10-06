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
export enum DataFieldLocationType {
  'Department' = 'Department',
  'DepartmentReview' = 'DepartmentReview',
  'KnockoutScreen' = 'KnockoutScreen',
  'Task' = 'Task',
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
  icon?: string;
}
export interface DataFieldLocation extends SequelizeTimestamps {
  id: number;
  sepID: number;
  dataFieldID: number;
  locationID: number;
  locationType: DataFieldLocationType;
  required: boolean;
  readOnly: boolean;
  dataFieldLocationTemplateID?: number;
}
export interface DataFieldLocationTemplate {
  id: number;
  dataFieldTemplateID: number;
  locationID: number;
  locationType: DataFieldLocationType;
  required: boolean;
  readOnly: boolean;
}
export interface DataFieldWithOptionsAndLocations extends DataField {
  dataFieldOptions: DataFieldOption[];
  dataFieldLocations: DataFieldLocation[];
}
export interface DataFieldWithOptionsAndSingleLocation extends DataField {
  dataFieldOptions: DataFieldOption[];
  dataFieldLocation: DataFieldLocation;
}

export interface DataFieldWithOptionsAndLocationsAndKnockoutFollowupTasks
  extends DataFieldWithOptionsAndLocations {
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
  icon?: string;
}

export interface DataFieldOptionTemplate {
  id: number;
  value: string;
  dataFieldTemplateID: number;
  selected?: boolean;
  description?: string;
  icon?: string;
}

export interface DataFieldTemplate {
  id: number;
  name: string;
  description?: string;
  type: DataFieldType;
  icon?: string;
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
