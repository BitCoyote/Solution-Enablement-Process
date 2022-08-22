import express from 'express';
import mockDB from '../../utils/mocks/mock-db';
import mockResponse from '../../utils/mocks/mock-response';
import mockRequest from '../../utils/mocks/mock-request';
import userController from './user.controller';
import Database from '../../database';
jest.mock('../../utils/logger.ts', () => ({
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn()
}));
describe('user controller', () => {
  let req: express.Request, res: express.Response, db: Database;
  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    db = mockDB;
  });
  describe('getUser function', () => {
    it('should return an error when no id parameter is passed', async () => {
      await userController.getUser(
        req,
        res,
        db
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('No id parameter was passed.');
    });
    it('should return an error when the user is not in the database.', async () => {
      req.params.id = 'abc';
      db.User.findOne = jest.fn().mockReturnValue(null);
      await userController.getUser(
        req,
        res,
        db
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Cannot find user.');
    });
    it('should return an error if SQL throws an error', async () => {
      const errMessage = 'Something bad happened!';
      req.params.id = 'abc';
      db.User.findOne = jest.fn(() => {
        throw Error(errMessage);
      });
      await userController.getUser(
        req,
        res,
        db
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(new Error(errMessage));

    });
    it('should successfully return a user when "me" is passed as the id parameter', async () => {
      req.params.id = 'me';
      const fakeUser = {
        id: 'def'
      }
      db.User.findOne = jest.fn().mockReturnValue(fakeUser);
      await userController.getUser(
        req,
        res,
        db
      );
      expect(res.send).toHaveBeenCalledWith(fakeUser);
    });
    it('should successfully return a user', async () => {
      req.params.id = 'abc';
      const fakeUser = {
        id: req.params.id
      }
      db.User.findOne = jest.fn().mockReturnValue(fakeUser);
      await userController.getUser(
        req,
        res,
        db
      );
      expect(res.send).toHaveBeenCalledWith(fakeUser);
    });

  });
});
