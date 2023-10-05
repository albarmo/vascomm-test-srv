'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate() {
     // define relation 
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'User fullname cannot be empty',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          argv: true,
          msg: 'email is already in use',
        },
        validate: {
          notEmpty: {
            args: true,
            msg: 'Email cannot be empty',
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          argv: true,
          msg: 'phone number is already in use',
        },
        validate: {
          notEmpty: {
            args: true,
            msg: 'User phone number cannot be empty',
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Password cannot be empty',
          },
          len: {
            args: [5, 30],
            msg: 'Minimum length of password is 5',
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate(instance) {
          instance.id = uuidv4();
          instance.password = hashPassword(instance.password);
          instance.role = 'customer';
        },
        beforeUpdate(instance) {
          instance.password = hashPassword(instance.password);
        },
      },
      sequelize,
      paranoid: true,
      deletedAt: 'destroyTime',
      modelName: 'User',
    }
  );
  return User;
};
