import { Sequelize } from 'sequelize';
import OperationFactory from '@models/operation.model';
import OperationRecordFactory from '@models/operation-record.model';
import UserFactory from '@models/user.model';
import envConfig from './config';
import { logger } from './logger';

export const db: any = {};

export class SequelizeDB {
  db: string;
  user: string;
  password: string;
  host: string;
  port: number;
  maxPool: number;
  minPool: number;

  constructor() {
    this.db = envConfig.sql.db;
    this.user = envConfig.sql.user;
    this.password = envConfig.sql.password;
    this.host = envConfig.sql.host;
    this.port = Number(envConfig.sql.port);
    this.maxPool = Number(envConfig.MAX_POOL) || 10;
    this.minPool = Number(envConfig.MIN_POOL) || 1;
  }

  initDataBase = async (): Promise<void> => {
    try {
      logger.info('Initializing PostgreSQL Database');
      const sequelize = new Sequelize(this.db, this.user, this.password, {
        host: this.host,
        dialect: 'postgres',
        port: this.port,
        logging: (msg) => logger.verbose(msg),
        pool: {
          max: this.maxPool,
          min: this.minPool,
          acquire: 30000,
          idle: 10000,
        },
      });

      db.sequelize = sequelize;
      db.User = UserFactory(sequelize);
      db.Operation = OperationFactory(sequelize);
      db.OperationRecord = OperationRecordFactory(sequelize);

      Object.keys(db)
        .forEach((modelName) => {
          if (db[modelName].associate) {
            db[modelName].associate(db);
          }
        });

      await sequelize.authenticate();
      logger.info('Connection has been established successfully.');
      await sequelize.sync();
      logger.info('PostgreSQL Database synchronized');
    } catch (e) {
      logger.error('Unable to connect to the database:', e);
    }
  };
}
