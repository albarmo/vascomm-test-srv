'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      History.belongsTo(models.User, {
        targetKey: 'id',
        foreignKey: 'UserId',
      });
      History.belongsTo(models.Cart, {
        targetKey: 'id',
        foreignKey: 'CartId',
      });
    }
  }
  History.init(
    {
      UserId: DataTypes.UUID,
      CartId: DataTypes.UUID,
      date: DataTypes.DATE,
      status: DataTypes.STRING,
      paymentDate: DataTypes.DATE,
    },
    {
      hooks: {
        beforeCreate(instance) {
          instance.id = uuidv4();
        },
      },
      sequelize,
      modelName: 'History',
    }
  );
  return History;
};
