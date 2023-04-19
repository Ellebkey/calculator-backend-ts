import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import moment from 'moment';
import { db } from '@config/sequelize';
import APIError from '@utils/APIError';
import envConfig from '@config/config';
import { logger } from '@config/logger';

const apiError = new APIError(
  'user-validation',
  'An unexpected error occurred',
  400,
  undefined,
);
const hours = 8;
const expiresIn = 60 * 60 * hours;

export class AuthController {
  public async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const user = await db.User.findOne({ where: { username: req.body.username } });

      if (!user) {
        apiError.status = 404;
        apiError.message = 'El usuario no existe, favor de verificar';
        return next(apiError);
      }

      const validPassword = await bcrypt.compare(req.body.password, user.hashedPassword);

      if (!validPassword) {
        apiError.status = 401;
        apiError.message = 'Contraseña incorrecta.';
        apiError.name = 'user-error-signin';
        apiError.tag = 'user-error-signin';
        return next(apiError);
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        envConfig.jwtSecret, { expiresIn },
      );

      return res.json({
        token,
        username: user.username,
        expiresIn: moment(new Date()).add(hours, 'hours').format(),
      });
    } catch (err) {
      logger.error('Error on login');
      logger.error(err);
      apiError.stack = err.stack;
      return next(apiError);
    }
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const t = await db.sequelize.transaction();

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = {
        hashedPassword,
        username: req.body.username,
      };

      await db.User.create(user, { transaction: t });

      const token = jwt.sign(
        {
          username: user.username,
        },
        envConfig.jwtSecret, { expiresIn },
      );

      await t.commit();

      return res.json({
        token,
        username: user.username,
        expiresIn: moment(new Date()).add(hours, 'hours').format(),
      });
    } catch (err) {
      await t.rollback();
      logger.error('Error on singup');
      apiError.stack = err.stack;
      apiError.tag = 'user-error-registration';
      apiError.message = 'Ya existe un registro con este correo.';
      return next(apiError);
    }
  }

  public async changePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const t = await db.sequelize.transaction();
    const { username, password } = req.body;

    try {
      const user = await db.User.findOne({ where: { username } });

      if (!user) {
        apiError.status = 404;
        apiError.message = 'El usuario no existe, favor de verificar';
        return next(apiError);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.update({ hashedPassword }, { transation: t });
      await t.commit();

      return res.json({
        response: 'success',
      });
    } catch (err) {
      await t.rollback();
      logger.error('Error on changing password');
      logger.error(err);
      apiError.stack = err.stack;
      return next(apiError);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const t = await db.sequelize.transaction();
    const { username } = req.body;

    const randomPassword = crypto.randomBytes(4).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    try {
      const user = await db.User.findOne({ where: { username } });

      if (!user) {
        apiError.status = 404;
        apiError.message = 'El usuario no existe, favor de verificar';
        return next(apiError);
      }

      user.update({ hashedPassword }, { transation: t });
      await t.commit();

      return res.json({
        response: 'success',
      });
    } catch (err) {
      await t.rollback();
      logger.error('Error on password reset');
      logger.error(err);
      apiError.stack = err.stack;
      return next(apiError);
    }
  }
}

export default AuthController;
