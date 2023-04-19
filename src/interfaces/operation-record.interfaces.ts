import { Model } from 'sequelize';

export interface OperationRecordAttributes {
  id?: number;
  amount: number;
  userBalance: number;
  operationResponse: number;
}

export interface OperationRecord {
  id: number;
  amount: number;
  userBalance: number;
  operationResponse: number;
  userId: number;
  operationId: number;
}

export interface OperationRecordReq extends OperationRecord, Model {}
