import { Sequelize, DataTypes, Model } from 'sequelize';
import { ModelStatic } from '@interfaces/sequelize.interface';
import { OperationRecordAttributes } from '@interfaces/operation-record.interfaces';

/**
 * OperationRecord Schema
 */

interface OperationRecordInstance extends Model<OperationRecordAttributes>, OperationRecordAttributes {}

const OperationRecordFactory = (sequelize: Sequelize): OperationRecordInstance => {
  const attributes = {
    amount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    userBalance: {
      field: 'user_balance',
      type: DataTypes.DECIMAL(10, 2),
    },
    operationResponse: {
      field: 'operation_response',
      type: DataTypes.STRING(255),
    },
    userId: {
      field: 'user_id',
      type: DataTypes.UUID,
    },
    operationId: {
      field: 'operation_id',
      type: DataTypes.INTEGER,
    },
  };

  const OperationRecord = <ModelStatic>sequelize
    .define<OperationRecordInstance, OperationRecordAttributes>('OperationRecord', attributes,
    {
      tableName: 'operation_record',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });

  // OperationRecord.associate = (models) => {
  //   OperationRecord.belongsTo(models.OperationRecordRecord, { as: 'records', foreignKey: 'article_id' });
  // };

  return <OperationRecordInstance><unknown>OperationRecord;
};

export default OperationRecordFactory;
