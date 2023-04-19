import { Router } from 'express';
import UserController from '@controllers/user.controller';
import Auth from '@middlewares/auth';

export class ClientTrip {
  public userCtlr = new UserController();
  public canAccess = new Auth().checkAuth;
  public router: Router = Router();

  public constructor() {
    this.init();
  }

  public init(): void {
    this.router.route('/user/:thisUserId')
      .all(this.canAccess)
      .get(this.userCtlr.read)
      .put(this.userCtlr.update);

    this.router.param('thisUserId', this.userCtlr.getById);
  }
}

// noinspection JSUnusedGlobalSymbols
export default new ClientTrip().router;
