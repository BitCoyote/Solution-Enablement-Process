import * as bodyParser from 'body-parser';
import express from 'express';
import routes from './routes';
import authentication from './utils/authentication';
import logRequest from './utils/log-request';
import Database from './models';
import databaseUtil from './utils/database-connect';
import cors from 'cors';
import compression from 'compression';
import swagger from './swagger';
import { Sequelize } from 'sequelize/types';

export const createApp = async () => {
    const db = new Database(await databaseUtil() as Sequelize);
    const app = express();
    app.use(compression());
    app.use(cors());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use((req, res, next) => authentication(req, res, next, db));
    app.use(logRequest);
    swagger(app);
    routes(app, db);
    return { app, db };
}
