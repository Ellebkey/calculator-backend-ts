// interfaces declared for Express req object

declare namespace Express {
  export interface Request {
    operationRecord: import('../interfaces/operation-record.interfaces').OperationRecordReq;
    operation: import('../interfaces/operation.interfaces').OperationReq;
    user: import('../interfaces/user.interfaces').UserPayload;
    userClient: import('../interfaces/user.interfaces').UserPayload;
  }
}
