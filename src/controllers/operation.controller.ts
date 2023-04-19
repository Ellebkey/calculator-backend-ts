import { Request, Response, NextFunction } from 'express';
import { db } from '@config/sequelize';
import { logger } from '@config/logger';
import axios from 'axios';

const DEFAULT_BALANCE = 200;

export class OperationController {
  public async list(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { limit = 10, offset = 0 } = req.query;

    try {
      const operations = await db.Operation.findAll({
        limit: +limit,
        offset: +offset,
      });

      logger.info('getting operations list');

      return res.json(operations);
    } catch (err) {
      logger.error('Error on getting operations list');
      return next(err);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const t = await db.sequelize.transaction();
    try {
      const operationObj = await db.Operation.findOne({ where: { operationType: req.body.operation } });
      const userBalance = await getUserBalance(req.user.id);

      const operationResult = await calculateOperation(req.body);
      const newBalance = +userBalance - +operationObj.cost;

      const record = {
        amount: operationObj.cost,
        userBalance: newBalance,
        operationResponse: operationResult,
        userId: req.user.id,
        operationId: operationObj.id,
      };
      const recordCreated = await db.OperationRecord.create(record, { transaction: t });

      await t.commit();

      return res.json(recordCreated);
    } catch (err) {
      await t.rollback();
      logger.error('Error on creating operation');
      return next(err);
    }
  }

  public async getBalance(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const balance = await getUserBalance(req.user.id);

      logger.info('getting user balance');

      return res.json({ balance });
    } catch (err) {
      logger.error('Error on getting user balance');
      return next(err);
    }
  }

  public async getRecordslist(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { limit = 10, offset = 0 } = req.query;
    const userId = req.user.id;
    try {
      const records = await db.OperationRecord.findAll({
        limit: +limit,
        offset: +offset,
        where: { userId },
        order: [['created_at', 'DESC']],
      });

      const recordsList = await db.OperationRecord.findAll({
        where: { userId },
      });

      logger.info('getting records list');

      return res.json({
        records,
        totalCount: recordsList.length,
      });
    } catch (err) {
      logger.error('Error on getting records list');
      return next(err);
    }
  }
}

const calculateOperation = async (params): Promise<string | number> => {
  const { operation, value1 = 1, value2 = 1 } = params;
  let result;
  if (operation === 'addition') {
    result = value1 + value2;
  } else if (operation === 'subtraction') {
    result = value1 - value2;
  } else if (operation === 'multiplication') {
    result = value1 * value2;
  } else if (operation === 'division') {
    result = value1 / value2;
  } else if (operation === 'square_root') {
    result = Math.sqrt(value1);
  } else if (operation === 'random_string') {
    const randS = await generateRandomString();
    result = randS;
  }
  return result;
};

const getUserBalance = async (userId): Promise<number> => {
  const records = await db.OperationRecord.findAll({
    where: { userId },
    limit: 1,
    order: [['created_at', 'DESC']],
  });

  let balance = DEFAULT_BALANCE; // default balance
  if (records.length > 0) {
    balance = records[0].userBalance;
  }

  return balance;
};

const generateRandomString = async (): Promise<string> => {
  const response = await axios.get('https://www.random.org/strings/', {
    params: {
      num: 1,
      len: 10,
      digits: 'on',
      upperalpha: 'on',
      loweralpha: 'on',
      unique: 'on',
      format: 'plain',
      rnd: 'new',
    },
  });
  return response.data;
};

export default OperationController;
