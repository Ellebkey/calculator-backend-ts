import { Sequelize, DataTypes, Model } from 'sequelize';
import { ModelStatic } from '@interfaces/sequelize.interface';
import { UserAttributes } from '@interfaces/user.interfaces';

/**
 * User Schema
 */

interface UserInstance extends Model<UserAttributes>, UserAttributes {}

const UserFactory = (sequelize: Sequelize): UserInstance => {
  const attributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isUnique: async (value, next) => {
          try {
            const user = await User.findOne({
              where: { username: value },
            });
            if (user && user.username === value) {
              return next('The email already exits');
            }
            return next();
          } catch (e) {
            return next(e);
          }
        },
      },
    },
    hashedPassword: {
      field: 'hashed_password',
      type: DataTypes.STRING,
      allowNull: false,
    },
    recordStatus: {
      field: 'record_status',
      type: DataTypes.BOOLEAN,
    },
  };

  const User = <ModelStatic>sequelize
    .define<UserInstance, UserAttributes>('User', attributes,
    {
      tableName: 'user',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });

  User.associate = (models) => {
    User.hasMany(models.OperationRecord, { as: 'records', foreignKey: 'user_id' });
  };

  return <UserInstance><unknown>User;
};

export default UserFactory;
