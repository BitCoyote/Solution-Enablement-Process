import { DataFieldWithOptionsAndKnockoutFollowupTasks } from '../../shared/types/DataField';
import {
  KnockoutFollowupType,
  KnockoutScreenFollowup,
  KnockoutScreenWithCompletion,
  KnockoutScreenWithDataFields,
} from '../../shared/types/Knockout';
import Database from '../models';

/** Returns an ordered list of screens with data fields that a user must answer based on their previous knockout answers. Screens are ordered based on a "dive-first" strategy, meaning that followup screens will appear before sibling screens. */
export const getKnockoutScreenList = async (
  db: Database,
  sepID: number
): Promise<KnockoutScreenWithCompletion[]> => {
  const sepKnockoutScreens = (
    (await db.KnockoutScreen.findAll({
      where: { sepID },
      include: [
        {
          model: db.DataField,
          as: 'dataFields',
          include: [
            {
              model: db.DataFieldOption,
              as: 'dataFieldOptions',
            },
          ],
        },
      ],
    })) as any
  ).map((a: any) => a.dataValues) as KnockoutScreenWithDataFields[];
  const sepKnockoutScreenFollowups = (
    (await db.KnockoutFollowup.findAll({
      where: { sepID, followupType: KnockoutFollowupType.KnockoutScreen },
    })) as any
  ).map((a: any) => a.dataValues) as KnockoutScreenFollowup[];

  const userScreenList: KnockoutScreenWithCompletion[] = [];
  const starterScreens = sepKnockoutScreens.filter((q) => q.starter);
  return appendScreens(userScreenList, starterScreens);
  function appendScreens(
    userScreenList: KnockoutScreenWithCompletion[],
    knockoutScreenSublist: KnockoutScreenWithDataFields[]
  ) {
    knockoutScreenSublist.forEach((knockoutScreen) => {
      let screenComplete = true;
      knockoutScreen.dataFields.forEach((dataFieldForScreen) => {
        if (
          dataFieldForScreen.required &&
          !dataFieldForScreen.value &&
          !dataFieldForScreen.dataFieldOptions.find(
            (dataFieldOptionForDataField) =>
              dataFieldOptionForDataField.selected
          )
        ) {
          screenComplete = false;
        }
      });
      userScreenList.push({
        ...knockoutScreen,
        complete: screenComplete,
      });

      // If this knockout screen has any followup screens based on the user's answers, dive into those to check if they've answered them all.
      for (let i = 0; i < knockoutScreen.dataFields.length; i++) {
        const dataFieldForScreen = knockoutScreen.dataFields[i];
        const followupIDs = sepKnockoutScreenFollowups
          .filter((knockoutFollowup) => {
            return (
              knockoutFollowup.dataFieldID === dataFieldForScreen.id &&
              (dataFieldForScreen.value === knockoutFollowup.value ||
                dataFieldForScreen.dataFieldOptions.find(
                  (o) => o.value === knockoutFollowup.value && o.selected
                ))
            );
          })
          .map((f) => f.followupID);
        const followupScreens = sepKnockoutScreens.filter((screen) =>
          followupIDs.includes(screen.id)
        );
        userScreenList = appendScreens(userScreenList, followupScreens);
      }
    });
    return userScreenList;
  }
};

/** Returns a list of task IDs that should be enabled by default for an SEP, based on user knockout answers */
export const getDefaultEnabledTasks = (
  dataFields: DataFieldWithOptionsAndKnockoutFollowupTasks[]
): number[] => {
  const taskList: number[] = [];
  dataFields.forEach((dataField) => {
    dataField.knockoutTaskFollowups.forEach((knockoutTaskFollowup) => {
      if (
        knockoutTaskFollowup.value === dataField.value ||
        dataField.dataFieldOptions.find(
          (dataFieldOption) =>
            dataFieldOption.selected &&
            knockoutTaskFollowup.value === dataFieldOption.value
        )
      ) {
        taskList.push(knockoutTaskFollowup.followupID);
      }
    });
  });
  return taskList;
};
