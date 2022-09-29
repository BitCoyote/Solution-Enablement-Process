import { DataFieldType } from '../../shared/types/DataField';
import { DataFieldModel } from '../models/data-field.model';
import * as dataFieldsUtils from './data-fields';

describe('data-fields utils', () => {
  describe('castValueToString', () => {
    it('should set value to a string when a string is passed', () => {
      const dataField = new DataFieldModel();
      dataField.value = 'hello';
      dataFieldsUtils.castValueToString(dataField);
      expect(dataField.value).toEqual('hello');
    });
    it('should set value to a string when a boolean is passed', () => {
      const dataField = new DataFieldModel();
      dataField.value = true;
      dataFieldsUtils.castValueToString(dataField);
      expect(dataField.value).toEqual('true');
    });
    it('should set value to a string when a number is passed', () => {
      const dataField = new DataFieldModel();
      dataField.value = 100;
      dataFieldsUtils.castValueToString(dataField);
      expect(dataField.value).toEqual('100');
    });
  });
  describe('castToOriginalType', () => {
    it('should set value to a boolean for yesNo, checkbox, and toggle data field types', () => {
      const dataField = new DataFieldModel();
      dataField.value = 'true';
      dataField.type = DataFieldType.yesNo;
      dataFieldsUtils.castToOriginalType(dataField, dataField.type);
      expect(dataField.value).toEqual(true);
    });
    it('should set value to a number for number data field types', () => {
      const dataField = new DataFieldModel();
      dataField.value = '100';
      dataField.type = DataFieldType.number;
      dataFieldsUtils.castToOriginalType(dataField, dataField.type);
      expect(dataField.value).toEqual(100);
    });
    it('should set value to a string for all other data field types', () => {
      const dataField = new DataFieldModel();
      dataField.value = 'hello';
      dataField.type = DataFieldType.input;
      dataFieldsUtils.castToOriginalType(dataField, dataField.type);
      expect(dataField.value).toEqual('hello');
    });
  });
});
