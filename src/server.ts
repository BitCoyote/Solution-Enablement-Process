// It is important to require our dotenv config here, so the proper env variables are applied to all code run in this node process.
// It is also important to use "require" instead of "import", so that we can call "config()" before other modules are imported.
require('dotenv').config();
import * as bodyParser from 'body-parser';
import express from 'express';
import routes from './backend/routes';
import authentication from './backend/utils/authentication';
import logRequest from './backend/utils/log-request';
import Database from './backend/database';
import databaseUtil from './backend/utils/database-connect';
import cors from 'cors';
import compression from 'compression';
import swagger from './backend/swagger';

const app = express();
const db = new Database(databaseUtil());
// Apply middleware before setting up routes
app.use(compression());
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => authentication(req, res, next, db));
app.use(logRequest);
swagger(app);
routes(app, db);
app.listen(process.env.API_PORT, () => {
  console.log(
    `Express server listening on port ${process.env.API_PORT}`
  );
});

