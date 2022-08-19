import { Dialect, Sequelize } from 'sequelize';
import { Logger } from 'winston';
import logger from './logger';

let db: Sequelize;
const init = (): void => {
  const host = process.env.SQL_SERVER_HOST || 'localhost';
  const mode = process.env.SQL_SERVER_MODE || 'default';
  const domain = process.env.SQL_SERVER_DOMAIN || 'constellation';
  const userName = process.env.SQL_SERVER_USER || 'jegdba';
  const password = process.env.SQL_SERVER_PASS || 'password';
  const port = parseInt(process.env.SQL_SERVER_PORT || '1433');
  const instanceName = process.env.SQL_SERVER_INSTANCE_NAME;
  const benchmark = true;

  const databaseName = process.env.SQL_SERVER_DB || 'jeg-db';
  const options = { requestTimeout: 90000, encrypt: true };
  const logging = (...msg: any): Logger =>
    logger.info(`executed ${msg[0]} duration: ${msg[1]} ms`);
  const dialect: Dialect = 'mssql';
  const dialectOptions = { options };

  if (mode === 'ntlm') {
    Object.defineProperty(dialectOptions, 'authentication', {
      enumerable: true,
      value: {
        type: mode,
        options: {
          domain,
          userName,
          password
        }
      }
    });
  }

  if (
    'SQL_SERVER_INSTANCE_NAME' in process.env &&
    typeof instanceName === 'string'
  ) {
    Object.defineProperty(dialectOptions, 'instanceName', {
      enumerable: true,
      value: instanceName
    });
  }

  const config = {
    host,
    port,
    dialect,
    logging,
    dialectOptions,
    benchmark
  };

  try {
    if (mode === 'ntlm') {
      db = new Sequelize(databaseName, '', '', config);
    } else {
      db = new Sequelize(databaseName, userName, password, config);
    }
    db.authenticate().then(() => {
      logger.info('Successfully connected to database.');
    });
  } catch (err) {
    logger.error('Could not connect to database. Sequelize error:', err);
  }
};

export default (): Sequelize => {
  if (!db) {
    init();
  }
  return db;
};
