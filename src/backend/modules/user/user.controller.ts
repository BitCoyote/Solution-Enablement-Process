import express from 'express';
import Database from '../../models';

export default {
  getUser: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const id = req.params.id === 'me' ? res.locals.user.oid : req.params.id;
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
      if (!dbUser) {
        return res.status(404).send('Cannot find user.')
      }
      return res.send(dbUser); 
  }
};
