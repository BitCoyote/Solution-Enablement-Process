import {
  DataFieldType,
  DataFieldWithOptions,
  DataFieldWithOptionsAndKnockoutFollowupTasks,
} from '../../shared/types/DataField';
import {
  KnockoutFollowupType,
  KnockoutScreenFollowup,
  KnockoutScreenWithDataFields,
} from '../../shared/types/Knockout';
import * as knockouts from './knockouts';

describe('knockouts util', () => {
  describe('getKnockoutScreenList', () => {
    it('should return only the starter questions when I have not answered any questions', () => {
      const defaultDataField: DataFieldWithOptions = {
        id: 1,
        createdAt: 'h',
        updatedAt: 'h',
        createdBy: 'system',
        name: 'Blorg',
        type: DataFieldType.select,
        sepID: 1,
        reviewTab: false,
        required: true,
        dataFieldOptions: [
          {
            id: 1,
            createdAt: 'h',
            updatedAt: 'h',
            value: 'A',
            selected: false,
            dataFieldID: 1,
            sepID: 1,
          },
          {
            id: 2,
            createdAt: 'h',
            updatedAt: 'h',
            value: 'B',
            selected: false,
            dataFieldID: 1,
            sepID: 1,
          },
        ],
      };
      const sepKnockoutScreens: KnockoutScreenWithDataFields[] = [
        {
          id: 1,
          sepID: 1,
          createdAt: 'h',
          updatedAt: 'h',
          name: 'blah',
          starter: true,
          dataFields: [
            {
              ...defaultDataField,
            },
          ],
        },
        {
          id: 2,
          sepID: 1,
          createdAt: 'h',
          updatedAt: 'h',
          name: 'blah',
          starter: true,
          dataFields: [
            {
              ...defaultDataField,
            },
          ],
        },
        {
          id: 3,
          sepID: 1,
          createdAt: 'h',
          updatedAt: 'h',
          name: 'blah',
          starter: false,
          dataFields: [
            {
              ...defaultDataField,
            },
          ],
        },
      ];

      const sepKnockoutScreenFollowups: KnockoutScreenFollowup[] = [
        {
          createdAt: 'h',
          updatedAt: 'h',
          id: 1,
          value: 'A',
          dataFieldID: 1,
          followupID: 3,
          followupType: KnockoutFollowupType.KnockoutScreen,
          sepID: 1,
        },
      ];
      const result = knockouts.getKnockoutScreenList(
        sepKnockoutScreens,
        sepKnockoutScreenFollowups
      );
      const starterQuestions = sepKnockoutScreens.filter((q) => q.starter);
      expect(result.length).toEqual(starterQuestions.length);
      expect(result[0].complete).toEqual(false);
    });
    it('should return an updated list of screens in the correct order when datafields have valid followup values', () => {
      const defaultDataField: DataFieldWithOptions = {
        id: 1,
        createdAt: 'h',
        updatedAt: 'h',
        createdBy: 'system',
        name: 'Blorg',
        type: DataFieldType.select,
        sepID: 1,
        reviewTab: false,
        required: true,
        dataFieldOptions: [
          {
            id: 1,
            createdAt: 'h',
            updatedAt: 'h',
            value: 'A',
            selected: true,
            dataFieldID: 1,
            sepID: 1,
          },
          {
            id: 2,
            createdAt: 'h',
            updatedAt: 'h',
            value: 'B',
            selected: false,
            dataFieldID: 1,
            sepID: 1,
          },
        ],
      };
      const noValueDataFieldOptions = [
        {
          id: 1,
          createdAt: 'h',
          updatedAt: 'h',
          value: 'A',
          selected: false,
          dataFieldID: 1,
          sepID: 1,
        },
        {
          id: 2,
          createdAt: 'h',
          updatedAt: 'h',
          value: 'B',
          selected: false,
          dataFieldID: 1,
          sepID: 1,
        },
      ];

      const sepKnockoutScreens: KnockoutScreenWithDataFields[] = [
        {
          id: 1,
          sepID: 1,
          createdAt: 'h',
          updatedAt: 'h',
          name: 'blah',
          starter: true,
          dataFields: [
            {
              ...defaultDataField,
              id: 1,
            },
          ],
        },
        {
          id: 2,
          sepID: 1,
          createdAt: 'h',
          updatedAt: 'h',
          name: 'blah',
          starter: true,
          dataFields: [
            {
              ...defaultDataField,
              id: 2,
              dataFieldOptions: noValueDataFieldOptions,
            },
          ],
        },
        {
          id: 3,
          sepID: 1,
          createdAt: 'h',
          updatedAt: 'h',
          name: 'blah',
          starter: false,
          dataFields: [
            {
              ...defaultDataField,
              id: 3,
              dataFieldOptions: noValueDataFieldOptions,
            },
          ],
        },
        {
          id: 4,
          sepID: 1,
          createdAt: 'h',
          updatedAt: 'h',
          name: 'blah',
          starter: false,
          dataFields: [
            {
              ...defaultDataField,
              id: 4,
              dataFieldOptions: noValueDataFieldOptions,
            },
          ],
        },
      ];

      const sepKnockoutScreenFollowups: KnockoutScreenFollowup[] = [
        {
          createdAt: 'h',
          updatedAt: 'h',
          id: 1,
          value: 'A',
          dataFieldID: 1,
          followupID: 3,
          followupType: KnockoutFollowupType.KnockoutScreen,
          sepID: 1,
        },
      ];
      const result = knockouts.getKnockoutScreenList(
        sepKnockoutScreens,
        sepKnockoutScreenFollowups
      );
      expect(result.length).toEqual(3);
      expect(result[0].id).toEqual(1);
      expect(result[0].complete).toEqual(true);
      expect(result[1].id).toEqual(3);
      expect(result[1].complete).toEqual(false);
      expect(result[2].id).toEqual(2);
      expect(result[2].complete).toEqual(false);
    });
  });
  describe('getDefaultEnabledTasks', () => {
    it('should return no tasks if I have not answered any data fields', () => {
      const defaultDataField: DataFieldWithOptions = {
        id: 1,
        createdAt: 'h',
        updatedAt: 'h',
        createdBy: 'system',
        name: 'Blorg',
        type: DataFieldType.select,
        sepID: 1,
        reviewTab: false,
        required: true,
        dataFieldOptions: [
          {
            id: 1,
            createdAt: 'h',
            updatedAt: 'h',
            value: 'A',
            selected: false,
            dataFieldID: 1,
            sepID: 1,
          },
          {
            id: 2,
            createdAt: 'h',
            updatedAt: 'h',
            value: 'B',
            selected: false,
            dataFieldID: 1,
            sepID: 1,
          },
        ],
      };
      const dataFields: DataFieldWithOptionsAndKnockoutFollowupTasks[] = [
        {
          ...defaultDataField,
          knockoutTaskFollowups: [
            {
              followupType: KnockoutFollowupType.Task,
              id: 1,
              value: 'A',
              dataFieldID: 1,
              followupID: 100,
              sepID: 1,
              createdAt: 'h',
              updatedAt: 'h',
            },
          ],
        },
      ];
      const result = knockouts.getDefaultEnabledTasks(dataFields);
      expect(result.length).toEqual(0);
    });
    it('should return a list of tasks based on the data fields with values and followups', () => {
      const defaultDataField: DataFieldWithOptions = {
        id: 1,
        createdAt: 'h',
        updatedAt: 'h',
        createdBy: 'system',
        name: 'Blorg',
        type: DataFieldType.select,
        sepID: 1,
        reviewTab: false,
        required: true,
        dataFieldOptions: [
          {
            id: 1,
            createdAt: 'h',
            updatedAt: 'h',
            value: 'A',
            selected: true,
            dataFieldID: 1,
            sepID: 1,
          },
          {
            id: 2,
            createdAt: 'h',
            updatedAt: 'h',
            value: 'B',
            selected: false,
            dataFieldID: 1,
            sepID: 1,
          },
        ],
      };
      const dataFields: DataFieldWithOptionsAndKnockoutFollowupTasks[] = [
        {
          ...defaultDataField,
          knockoutTaskFollowups: [
            {
              followupType: KnockoutFollowupType.Task,
              id: 1,
              value: 'A',
              dataFieldID: 1,
              followupID: 100,
              sepID: 1,
              createdAt: 'h',
              updatedAt: 'h',
            },
          ],
        },
      ];
      const result = knockouts.getDefaultEnabledTasks(dataFields);
      expect(result.length).toEqual(1);
    });
  });
});
