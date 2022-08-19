import * as bodyParser from 'body-parser';
import express from 'express';
import router from './routes';
import authentication from './utils/authentication';
import logRequest from './utils/log-request';
import Database from './database';
import databaseUtil from './utils/database-connect';
import cors from 'cors';
import compression from 'compression';
import swagger from './swagger';

const app: express.Application = express();
// Apply middleware before setting up routes
app.use(compression());
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
const db = new Database(databaseUtil());
app.use((req, res, next) => authentication(req, res, next, db));
app.use(logRequest);
swagger(app);
export default router(app, db);
