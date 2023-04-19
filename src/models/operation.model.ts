import { Sequelize, DataTypes, Model } from 'sequelize';
import { ModelStatic } from '@interfaces/sequelize.interface';
import { OperationAttributes } from '@interfaces/operation.interfaces';

/**
 * Account Schema
 */
interface OperationInstance extends Model<OperationAttributes>, OperationAttributes {}

const OperationFactory = (sequelize: Sequelize): OperationInstance => {
  const attributes = {
    operationType: {
      field: 'operation_type',
      type: DataTypes.STRING(50),
    },
    cost: {
      type: DataTypes.INTEGER,
    },
  };

  const Operation = <ModelStatic>sequelize
    .define<OperationInstance, OperationAttributes>('Operation', attributes,
    {
      tableName: 'operation',
      underscored: true,
      timestamps: false,
    });

  Operation.associate = (models) => {
    Operation.hasMany(models.OperationRecord, { as: 'records', foreignKey: 'operation_id' });
  };

  return <OperationInstance><unknown>Operation;
};

export default OperationFactory;
