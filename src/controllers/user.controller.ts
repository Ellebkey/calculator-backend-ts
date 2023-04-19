import { Request, Response, NextFunction } from 'express';
import { db } from '@config/sequelize';
import { logger } from '@config/logger';

export class UserController {
  public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { user } = req;
    const t = await db.sequelize.transaction();
    try {
      await user.update(req.body, { transaction: t });
      await user.person.update(req.body, { transaction: t });

      await t.commit();

      const updatedDriver = await getUserById(user.id);
      return res.json(updatedDriver);
    } catch (err) {
      await t.rollback();
      logger.error('Error on userClient update');
      return next(err);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction, id: string): Promise<Response | void> {
    try {
      const userClient = await getUserById(id);
      if (!userClient) {
        const customErr = {
          status: 404,
          message: `User with id: ${id}, was not found`,
          tag: 'data-not-found',
        };
        return next(customErr);
      }

      req.userClient = userClient;
      return next();
    } catch (err) {
      logger.error('Error on getting single userClient');
      return next(err);
    }
  }

  public async read(req: Request, res: Response): Promise<Response | void> {
    return res.json(req.userClient);
  }
}

const getUserById = async (id: string) => db.User.findByPk(id, {
  attributes: ['id', 'displayName'],
});
export default UserController;
