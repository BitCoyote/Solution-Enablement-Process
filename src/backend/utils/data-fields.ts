import { DataFieldType } from '../../shared/types/DataField';
import { DataFieldModel } from '../models/data-field.model';
import { KnockoutFollowupModel } from '../models/knockout-followup.model';

/**  Typecast value to string for storage */
export const castValueToString = (
  model: DataFieldModel | KnockoutFollowupModel
) => {
  if (model.value !== undefined && model.value !== null) {
    model.value = String(model.value);
  }
};

/**  Typecast value back to original type for application use */
export const castToOriginalType = (
  model: DataFieldModel | KnockoutFollowupModel,
  type: DataFieldType
) => {
  const booleanTypes: DataFieldType[] = [
    DataFieldType.yesNo,
    DataFieldType.checkbox,
    DataFieldType.toggle,
  ];
  if (model.value !== undefined && model.value !== null) {
    if (type === DataFieldType.number) {
      // Cast as number
      model.value = parseFloat(model.value as string);
    } else if (booleanTypes.includes(type)) {
      // Cast as boolean
      model.value = model.value === 'true';
    }
  }
};
