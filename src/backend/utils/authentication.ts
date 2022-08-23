import express from 'express';
import logger from './logger';
import Database from '../database';
import initUser from './init-user';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import moment from 'moment';
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
    '/api-docs',
    '/favicon.ico',
  ];
  if (authFreePaths.some((path: string) => new RegExp(path).test(req.path))) {
    return next();
  } else {
    try {
      res.locals.user = await validateToken(
        req.headers.authorization as string
      );
      let existingUser = await db.User.findOne({
        where: { id: res.locals.user.oid }
      });

      if (!existingUser && req.path === '/users/me') {
        // Init user here if there is no user in database.
        existingUser = await initUser(res.locals.user, db);
      }
      // Update the user's data in the databse from Active Directory once a week
      if (
        existingUser &&
        (!existingUser.lastActiveDirectoryUpdate ||
          moment(existingUser.lastActiveDirectoryUpdate)
            .add(7, 'days')
            .isBefore(moment()))
      ) {
        //get user active directory info
        const tokenResponse = await getToken();
        const GRAPH_URL = 'https://graph.microsoft.com/v1.0';
        const usersOpts: AxiosRequestConfig = {
          url: `${GRAPH_URL}/users/${existingUser.id}`,
          headers: {
            authorization: `Bearer ${tokenResponse.data['access_token']}`
          },
          params: {
            $select:
              'displayName,mail,id,department,officeLocation,givenName,surname,jobTitle'
          }
        };

        const adUserResponse = await axios.request<any>(usersOpts);
        const adUser = adUserResponse.data;
        await db.User.update(
          {
            ...adUser,
            lastActiveDirectoryUpdate: new Date()
          },
          { where: { id: adUser.id } }
        );
      }
      next();
    } catch (err) {
      logger.error(err);
      res.status(401).send('Unable to authenticate request.');
    }
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
const getToken = (): Promise<AxiosResponse<{access_token: string}>> => {
  const data: any = {
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    response_mode: 'fragment',
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials'
  };

  const tokenOpts: AxiosRequestConfig = {
    url: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}/oauth2/v2.0/token`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: Object.keys(data)
      .map(key => `${key}=${data[key]}`)
      .join('&')
  };

  return axios.request<{access_token: string}>(tokenOpts);
};
