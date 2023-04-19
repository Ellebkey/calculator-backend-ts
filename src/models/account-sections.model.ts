import { Sequelize, DataTypes, Model } from 'sequelize';
import { ModelStatic } from '@interfaces/sequelize.interface';
import { AccountSectionAttributes } from '@interfaces/account.interfaces';

/**
 * AccountSection Schema
 */
interface AccountSectionInstance extends Model<AccountSectionAttributes>, AccountSectionAttributes {}

const AccountSectionFactory = (sequelize: Sequelize): AccountSectionInstance => {
  const attributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(50),
    },
    comments: {
      type: DataTypes.TEXT,
    },
    currentAmount: {
      type: DataTypes.DECIMAL(10, 3),
    },
    accountId: {
      type: DataTypes.INTEGER,
      field: 'account_id',
    },
  };

  const AccountSection = <ModelStatic>sequelize
    .define<AccountSectionInstance, AccountSectionAttributes>('AccountSection', attributes,
    {
      tableName: 'account_section',
      underscored: true,
      timestamps: false,
    });

  AccountSection.associate = (models) => {
    AccountSection.belongsTo(models.Account, { as: 'account', foreignKey: 'account_id' });
  };

  return <AccountSectionInstance><unknown>AccountSection;
};

export default AccountSectionFactory;
