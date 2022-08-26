import express from 'express';
import logger from './logger';
import Database from '../models';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { isBefore, addDays } from 'date-fns'
import { Op } from 'sequelize';
import { NewUser } from '../../shared/types/User';
import { UserModel } from '../models/user.model';
const jwt = require('jsonwebtoken');
/**
 * @function void Express middleware to decode token and attach to res.locals
 * @param {express.Request} req Express request object
 * @param {express.Response} res Express response object
 * @param {express.NextFunction} next Express response object
 * @param {Database} db Database object
 */
export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  db: Database
): Promise<void> => {
  const authFreePaths = [
    '/api-docs'
  ];
  if (authFreePaths.some((path: string) => new RegExp(path).test(req.path))) {
    return next();
  }
  try {
    const bypassAuth = process.env.BYPASS_AUTH === 'true';
    // Bypass token validation for automated testing.
    if (bypassAuth) {
      const token = (req.headers.authorization as string)?.split(' ')[1];
      const decoded = jwt.decode(token || 'invalid', { complete: true }) as any;
      res.locals.user = decoded.payload;
    } else {
      res.locals.user = await validateToken(
        req.headers.authorization as string
      )
    }
    let existingUser = await db.User.findOne({
      where: { id: res.locals.user.oid }
    });
    if (req.path === '/users/me') {
      // This route is meant to be hit first when the application loads in order to initialize the user.
      const userToUpsert: NewUser = {
        id: res.locals.user.oid,
        familyName: res.locals.user.family_name,
        givenName: res.locals.user.given_name,
        upn: res.locals.user.upn || res.locals.user.email || res.locals.user.preferred_username,
        officeLocation: res.locals.user.officeLocation,
        email: res.locals.user.mail,
        department: res.locals.user.department,
        displayName: res.locals.user.displayName || res.locals.user.name ,
        surname: res.locals.user.surname,
        jobTitle: res.locals.user.jobTitle
      };
      if (existingUser) {
        // Update the user's data in the database using claims in the token
        await existingUser.update(userToUpsert);
      } else {
        // Init user here if there is no user in database.
        existingUser = await db.User.create(userToUpsert as any);
      }
    }

    const userRoleOptions = {
      where: {
        userId: {
          [Op.eq]: res.locals.user.oid
        }
      }
    };
    const userRoles = await db.UserRole.findAll(userRoleOptions);
    const roleOptions: any = {
      where: {
        id: {
          [Op.in]: userRoles.map(ur => ur.roleID)
        }
      },
      include: {
        model: db.Permission,
        as: 'permissions',
        through: { attributes: [] }
      }
    };
    res.locals.user.roles = await db.Role.findAll(roleOptions);
    next();
  } catch (err) {
    logger.error(err);
    res.status(401).send('Unable to authenticate request.');
  }

};

let keyCache: any[] = [];
const validateToken = async (authHeader: string) => {
  const token = authHeader?.split(' ')[1];
  const decoded = jwt.decode(token || 'invalid', { complete: true }) as any;
  let key = keyCache.find((key: any) => key.kid === decoded.header.kid);
  if (!key) {
    // If the key cannot be found in existing key cache, request the keys again and update the cache.
    keyCache = (
      await axios.get(
        `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}/discovery/v2.0/keys?appid=${process.env.REACT_APP_CLIENT_ID}`
      )
    ).data.keys;
    key = keyCache.find((key: any) => key.kid === decoded.header.kid);
  }
  const completeKey = `-----BEGIN CERTIFICATE-----\n${key.x5c[0]}\n-----END CERTIFICATE-----`;
  return jwt.verify(token, completeKey, { algorithms: ['RS256'] });
};
