import express from 'express';
import Database from '../../models';
import { getKnockoutScreenList } from '../../utils/knockouts';
const knockoutController = {
  getKnockoutScreens: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const sepID = parseInt(req.params.sepID);
    const knockoutScreenList = await getKnockoutScreenList(db, sepID);
    return res.send(knockoutScreenList);
  },
};

export default knockoutController;
