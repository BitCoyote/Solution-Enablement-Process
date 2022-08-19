import express from 'express';
import logger from '../../utils/logger';
import Database from '../../database';

export default {
  getUser: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    if (!req.params.id) {
      return res.status(400).send('No id parameter was passed.')
    }
    const id = req.params.id === 'me' ? res.locals.user.oid : req.params.id;
    try {
      const dbUser = await db.User.findOne({
        where: { id },
        include: [{
          model: db.Role,
          as: 'roles',
          through: { attributes: [] },
          include: [{
            model: db.Permission,
            as: 'permissions',
            through: { attributes: [] }
          }]
        }]
      });
      return res.send(dbUser);
    } catch (err) {
      logger.error(err);
      return res.status(500).send(err)
    }
  }
};
