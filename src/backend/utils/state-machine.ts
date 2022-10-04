import {
  KnockoutFollowupTemplate,
  KnockoutFollowupType,
} from '../../shared/types/Knockout';
import logger from './logger';
import {
  knockoutScreenTemplates,
  dataFieldTemplates,
  dataFieldOptionTemplates,
  knockoutFollowupTemplates,
  taskTemplates,
} from './template-data';

interface FollowupGroup {
  [key: string]: KnockoutFollowupTemplate[];
}

/** Convert from table structure to xstate data structure */
export const toStateMachine = () => {
  const machineConfig: any = {
    id: 'Knockout Screens',
    type: 'parallel',
    states: {
      End: {
        id: 'end',
      },
    },
  };
  // const starterScreens = knockoutScreenTemplates.filter(s => s.starter);
  knockoutScreenTemplates.forEach((screen) => {
    const screenTitle = `Knockout Screen ${screen.id}`;
    machineConfig.states[screenTitle] = {
      id: `screen-${screen.id}`,
      type: 'parallel',
      description: screen.name,
      states: {},
    };
    const dataFieldTemplatesForScreen = dataFieldTemplates.filter(
      (d) => d.knockoutScreenTemplateID === screen.id
    );
    const dataFieldStates: any = {};
    dataFieldTemplatesForScreen.forEach((dataFieldTemplateForScreen) => {
      const dataFieldTitle = `Data Field ${dataFieldTemplateForScreen.id}`;
      dataFieldStates[dataFieldTitle] = {
        description:
          dataFieldTemplateForScreen.name +
          (dataFieldTemplateForScreen.required ? '*' : ''),
        on: {},
      };
      const knockoutFollowupTemplatesForDataField =
        knockoutFollowupTemplates.filter(
          (k) => k.dataFieldTemplateID === dataFieldTemplateForScreen.id
        );
      // A single value could have multiple followups, so group them together here.
      const followupGroups: FollowupGroup = {};
      knockoutFollowupTemplatesForDataField.forEach(
        (knockoutFollowupTemplateForDataField) => {
          let value = knockoutFollowupTemplateForDataField.value;
          // Convert true/false values to yes/no to make it more clear on visualizer for non-devs
          if (value === true) {
            value = 'Yes';
          } else if (value === false) {
            value = 'No';
          }
          if (!followupGroups[String(value)]) {
            followupGroups[String(value)] = [];
          }
          followupGroups[String(value)].push(
            knockoutFollowupTemplateForDataField
          );
        }
      );
      for (const value in followupGroups) {
        const group = followupGroups[value];
        (dataFieldStates[dataFieldTitle] as any).on[value] = {
          target: [],
          actions: [],
        };
        group.forEach((followupTemplate) => {
          if (
            followupTemplate.followupType ===
            KnockoutFollowupType.KnockoutScreen
          ) {
            (dataFieldStates[dataFieldTitle] as any).on[value].target.push(
              `#screen-${followupTemplate.followupID}`
            );
          } else if (
            followupTemplate.followupType === KnockoutFollowupType.Task
          ) {
            const followupTaskTemplate = taskTemplates.find(
              (t) => t.id === followupTemplate.followupID
            );
            if (!followupTaskTemplate) {
              logger.warn(
                `Missing followup task for knockout followup template id: ${followupTemplate.id}`
              );
            } else {
              const departmentToAdd = followupTaskTemplate.departmentID;
              if (
                !(dataFieldStates[dataFieldTitle] as any).on[
                  value
                ].actions.includes(departmentToAdd)
              ) {
                (dataFieldStates[dataFieldTitle] as any).on[value].actions.push(
                  departmentToAdd
                );
              }
            }
          }
        });
        // If there's no target, the target array needs to be be pointed to "end" or the option won't appear on the visualizer
        if (
          (dataFieldStates[dataFieldTitle] as any).on[value].target.length === 0
        ) {
          (dataFieldStates[dataFieldTitle] as any).on[value].target.push(
            '#end'
          );
        }
      }
      const dataFieldOptions = dataFieldOptionTemplates.filter(
        (o) => o.dataFieldTemplateID === dataFieldTemplateForScreen.id
      );
      // If a data field option has no followups, we should point it do the "end" state so it shows the option in the visualizer
      dataFieldOptions.forEach((dataFieldOption) => {
        if (dataFieldOption.value) {
          const value = dataFieldOption.value;
          if (!(dataFieldStates[dataFieldTitle] as any).on[value]) {
            (dataFieldStates[dataFieldTitle] as any).on[value] = {
              target: '#end',
            };
          }
        }
      });
    });
    (machineConfig.states as any)[screenTitle].states = dataFieldStates;
  });
  return machineConfig;
};
export const knockoutMachine = toStateMachine();
