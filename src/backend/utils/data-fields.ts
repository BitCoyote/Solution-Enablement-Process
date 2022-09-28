import { DataFieldType } from '../../shared/types/DataField';
import { DataFieldModel } from '../models/data-field.model';

/**  Typecast value to string for storage */
export const castValueToString = (dataField: DataFieldModel) => {
  if (dataField.value !== undefined && dataField.value !== null) {
    dataField.value = '' + dataField.value + '';
  }
};

/**  Typecast value back to original type for application use */
export const castToOriginalType = (dataField: DataFieldModel) => {
  const booleanTypes: DataFieldType[] = [
    DataFieldType.yesNo,
    DataFieldType.checkbox,
    DataFieldType.toggle,
  ];
  if (dataField.value !== undefined && dataField.value !== null) {
    if (dataField.type === DataFieldType.number) {
      // Cast as number
      dataField.value = parseFloat(dataField.value as string);
    } else if (booleanTypes.includes(dataField.type)) {
      // Cast as boolean
      dataField.value = dataField.value === 'true';
    }
  }
};
