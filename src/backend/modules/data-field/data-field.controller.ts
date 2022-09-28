import express from 'express';
import { Op } from 'sequelize';
import {
  DataFieldOptionUpdate,
  DataFieldUpdate,
} from '../../../shared/types/DataField';
import Database from '../../models';
import { updateSEPPhaseAndTasks } from '../../utils/seps';

const dataFieldController = {
  updateDataFields: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const sepID = parseInt(req.params.sepID);
    const dataFields = req.body as DataFieldUpdate[];
    await db.sequelize.transaction(async (transaction) => {
      for (let i = 0; i < dataFields.length; i++) {
        const dataField = dataFields[i];
        await db.DataField.update(
          {
            value: dataField.value,
          },
          {
            where: { sepID, id: dataField.id },
            transaction,
            individualHooks: true,
          }
        );
        for (
          let k = 0;
          k < (dataField.dataFieldOptions as DataFieldOptionUpdate[])?.length ||
          0;
          k++
        ) {
          const dataFieldOption = (
            dataField.dataFieldOptions as DataFieldOptionUpdate[]
          )[k];
          await db.DataFieldOption.update(
            {
              selected: dataFieldOption.selected,
            },
            {
              where: { sepID, id: dataFieldOption.id },
              transaction,
              individualHooks: true,
            }
          );
        }
      }
    });
    updateSEPPhaseAndTasks(db, sepID);
    const dataFieldIDs = dataFields.map((df) => df.id);
    // Fields have been successfully updated. Send updated fields in response.
    const updatedFields = await db.DataField.findAll({
      where: { sepID, id: { [Op.in]: dataFieldIDs } },
      include: [
        {
          model: db.DataFieldOption,
          as: 'dataFieldOptions',
        },
      ],
    });
    return res.send(updatedFields);
  },
};

export default dataFieldController;
