import express from 'express';
import Database from '../../models';

export default {
    createRole: async (
        req: express.Request,
        res: express.Response,
        db: Database
    ): Promise<express.Response> => {
        const role = await db.Role.create({
            ...req.body,
            createdBy: res.locals.user.oid
        });
        return res.status(200).send(role);
    }
}
