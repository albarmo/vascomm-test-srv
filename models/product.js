'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate() {
      //
    }
  }
  Product.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          argv: true,
          msg: 'Product name must unique',
        },
        validate: {
          notEmpty: {
            args: true,
            msg: "Product's name cannot be empty",
          },
        },
      },
      status: {
        type: DataTypes.BOOLEAN,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Product's image cannot be empty",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Input price cannot be empty',
          },
          min: {
            args: [1],
            msg: 'Price cannot be less than one',
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate(instance) {
          instance.id = uuidv4();
        },
      },
      sequelize,
      paranoid: true,
      deletedAt: 'destroyTime',
      modelName: 'Product',
    }
  );
  return Product;
};
