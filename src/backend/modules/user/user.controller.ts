import express from 'express';
import Database from '../../models';

const userController = {
  getUser: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const id = req.params.id === 'me' ? res.locals.user.oid : req.params.id;
    const dbUser = await db.User.findOne({
      where: { id },
    });
    if (!dbUser) {
      return res.status(404).send('Cannot find user.');
    }
    return res.send(dbUser);
  },
  updateUser: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const user = await db.User.findByPk(req.params.id);
    // Existence of this user is checked in mustOwnResource middleware
    await user?.update(req.body, {
      where: { id: req.params.id },
    });
    return res.send(user);
  },
};

export default userController;
