import { Router } from 'express';
import OperationController from '@controllers/operation.controller';
import Auth from '@middlewares/auth';

export class OperationRoute {
  public operations = new OperationController();
  public canAccess = new Auth().checkAuth;
  public router: Router = Router();

  public constructor() {
    this.init();
  }

  public init(): void {
    this.router.route('/operations')
      .all(this.canAccess)
      .get(this.operations.list)
      .post(this.operations.create);

    this.router.route('/get-balance')
      .all(this.canAccess)
      .get(this.operations.getBalance);

    this.router.route('/records')
      .all(this.canAccess)
      .get(this.operations.getRecordslist);
  }
}

// noinspection JSUnusedGlobalSymbols
export default new OperationRoute().router;
