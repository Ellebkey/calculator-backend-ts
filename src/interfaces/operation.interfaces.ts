import { Model } from 'sequelize';

// Model
export interface OperationAttributes {
  id?: number;
  operationType: string;
  cost: number;
}

// Controllers
export interface Operation {
  id: number;
  operationType: string;
  cost: number;
}

export interface OperationReq extends Operation, Model {}
