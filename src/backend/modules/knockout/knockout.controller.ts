import express from 'express';
import {
  KnockoutFollowupType,
  KnockoutScreenFollowup,
  KnockoutScreenWithDataFields,
} from '../../../shared/types/Knockout';
import Database from '../../models';
import { getKnockoutScreenList } from '../../utils/knockouts';
const knockoutController = {
  getKnockoutScreens: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const sepID = parseInt(req.params.sepID);
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
    ).map((a: any) => a.dataValues);

    const sepKnockoutScreenFollowups = (
      (await db.KnockoutFollowup.findAll({
        where: { sepID, followupType: KnockoutFollowupType.KnockoutScreen },
      })) as any
    ).map((a: any) => a.dataValues);
    const knockoutScreenList = getKnockoutScreenList(
      sepKnockoutScreens as KnockoutScreenWithDataFields[],
      sepKnockoutScreenFollowups as unknown as KnockoutScreenFollowup[]
    );
    return res.send(knockoutScreenList);
  },
};

export default knockoutController;
