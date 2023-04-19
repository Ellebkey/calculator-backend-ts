import { Request, Response } from 'express';
import { OperationController } from '../src/controllers/operation.controller';

// Mock dependencies
jest.mock('@config/sequelize', () => ({
  db: {
    Operation: {
      findAll: jest.fn(),
    },
    OperationRecord: {
      create: jest.fn(),
      findAll: jest.fn(),
    },
  },
  sequelize: {
    transaction: jest.fn(() => ({
      commit: jest.fn(),
      rollback: jest.fn(),
    })),
  },
}));

jest.mock('@config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('axios', () => ({
  get: jest.fn(),
}));

describe('OperationController', () => {
  let operationController: OperationController;
  let req: Request;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    operationController = new OperationController();
    req = {} as Request;
    res = {} as Response;
    next = jest.fn();
  });

  describe('list', () => {
    it('should return a list of operations', async () => {
      const operations = [{ id: 1, name: 'Addition' }, { id: 2, name: 'Subtraction' }];
      (req.query as any) = { limit: 2, offset: 0 };
      (jest.spyOn(operationController, 'list') as any).mockResolvedValue(operations);
      (res.json as jest.Mock) = jest.fn();

      await operationController.list(req, res, next);

      expect(res.json).toHaveBeenCalledWith(operations);
    });

    it('should call the next middleware function if an error occurs', async () => {
      const error = new Error('Database error');
      (req.query as any) = { limit: 2, offset: 0 };
      (jest.spyOn(operationController, 'list') as any).mockRejectedValue(error);

      await operationController.list(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('create', () => {
    it('should create a new operation record and return it', async () => {
      (req.user as any) = { id: 1 };
      (req.body as any) = { operation: 'addition' };
      (jest.spyOn(operationController, 'create') as any).mockImplementation(async () => {
        const record = { id: 1, userId: 1, operationId: 1 };
        await Promise.resolve(); // wait for transaction to commit
        return record;
      });
      (res.json as jest.Mock) = jest.fn();

      await operationController.create(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ id: 1, userId: 1, operationId: 1 });
    });

    it('should call the next middleware function if an error occurs', async () => {
      const error = new Error('Database error');
      (req.user as any) = { id: 1 };
      (req.body as any) = { operation: 'addition' };
      (jest.spyOn(operationController, 'create') as any).mockRejectedValue(error);

      await operationController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
