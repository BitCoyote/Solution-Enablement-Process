import express from 'express';
import {
  CreateCommentBody,
  UpdateCommentBody,
} from '../../../shared/types/Comment';
import Database from '../../models';
import { CommentModel } from '../../models/comment.model';

const commentController = {
  getCommentsBySepID: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const sepID = parseInt(req.params.sepID);
    const comments = await db.Comment.findAll({
      where: {
        sepID,
      },
      include: [
        {
          model: db.User,
          as: 'creator',
          attributes: ['id', 'email', 'displayName'],
        },
        {
          model: db.Comment,
          as: 'replyComment',
        },
      ],
    });
    return res.send(comments);
  },
  createComment: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const commentToCreate = req.body as CreateCommentBody;
    const comment = await db.Comment.create({
      ...commentToCreate,
      createdBy: res.locals.user.oid,
    });
    return res.send(comment);
  },
  updateComment: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    // roles middleware has already validated that the user has the proper permissions to make this update
    const id = parseInt(req.params.id);
    const comment = (await db.Comment.findByPk(id)) as CommentModel;
    const updateBody: UpdateCommentBody = {
      comment: req.body.comment,
    };
    await comment.update(updateBody);
    return res.send(comment);
  },
  deleteComment: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    // The comment model has paranoid: true so this will perform a soft-deleted using the "deletedAt" column
    const comment = (await db.Comment.findByPk(
      parseInt(req.params.id)
    )) as CommentModel;
    await comment.destroy();
    return res.send();
  },
};

export default commentController;
