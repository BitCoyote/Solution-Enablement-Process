/* istanbul ignore file */
import { Dialect, Sequelize } from 'sequelize';
import logger from './logger';

const init = async (): Promise<Sequelize | null> => {
  const host = process.env.SQL_SERVER_HOST || 'localhost';
  const userName = process.env.SQL_SERVER_USER || 'sepdba';
  const password = process.env.SQL_SERVER_PASS || 'password';
  const port = parseInt(process.env.SQL_SERVER_PORT || '1433');
  const benchmark = true;
  const databaseName = process.env.SQL_SERVER_DB || 'sep-db';
  const options = { requestTimeout: 90000, encrypt: true };
  const dialect: Dialect = process.env.SQL_SERVER_DIALECT as Dialect;
  const dialectOptions = { options };

  let db: Sequelize | null = null;

  try {
    if (dialect === 'sqlite') {
      db = new Sequelize('sqlite::memory:', { logging: false });
    } else {
      const config = {
        host,
        port,
        dialect,
        logging: (...msg: any) => {
          logger.info(`executed ${msg[0]} duration: ${msg[1]} ms`)
        },
        dialectOptions,
        benchmark
      };
      db = new Sequelize(databaseName, userName, password, config);
    }
    await db.authenticate().then(() => {
      logger.info('Successfully connected to database.');
    }).catch((err: any) => console.warn(err));
  } catch (err) {
    logger.error('Could not connect to database. Sequelize error:', err);
  }
  return db;

};

export default async (): Promise<Sequelize | null> => {
  return await init();
};
