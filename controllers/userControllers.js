const { User } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const {generateAccessToken} = require( '../helpers/jwt' );
const { Op } = require('sequelize');

class UserController {
  static async getCurrentUser(req, res, next) {
    const { id } = req.userData;
    let data = await User.findOne({ where: { id: id } });
    try {
      if (data) {
        return res.status(200).json({code: '200',message:'Ok', data: data });
      } else {
        return res.status(500).json({code: '200',message: 'Authentification Error! User Not Found', data :id});
      }
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    const {limit, keyword, offset} = req.query
   
    const params = {}
    if (keyword) {
      params.name = {[Op.like]: `%${keyword}%`}
    }

    try {
      let data = await User.findAll( {
        where: {
         ...params
        },
        limit: limit || 10,
        offset: offset || 0,});
      if (data) {
        return res.status(200).json({code:'200', message:'OK', data: data });
      } else {
        return res.status(500).json({code: '404', message: 'user table empty', data:[] });
      }
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    let inputDataRegister = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      password:req.body.password
    };

    User.create(inputDataRegister, {})
      .then((data) => {
        return res.status(201).json({code:'200', message:'OK', data });
      })
      .catch((error) => {
        next(error);
      });
  }

  static async login( req, res, next )
  {
    const {email,password} = req.body
    const inputLogin = {
      email: req.body.email,
      password: req.body.password,
    };

    if ( !email || !password ) {
      return res.status( 400 ).json( {code: '400', message: 'Bad Request', data: {}} )
    }

    const user = await User.findOne({
      where: { email: inputLogin.email },
    });

    try {
      if (!user) {
        return res.status(400).json({ message: 'failed, user not registered' });
      } else if (!comparePassword(inputLogin.password, user.dataValues.password)) {
        return res.status(500).json({ code:'500', message: 'email or password wrong!' });
      } else {
        const token = generateAccessToken({
          id: user.id,
          email: user.email,
          password: user.password,
          role: user.role
        });
        return res.status(200).json({code:'200', message:'OK', data:{access_token: token} });
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    const { id } = req.params;
    const inputDataUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      type: req.body.type,
    };

    try {
      const userDataById = await User.findOne({
        where: {
          id: id,
        },
        returning: true,
        plain: true,
      });

      if (userDataById) {
        const updateUser = await User.update(inputDataUpdate, {
          where: {
            id: id,
          },
          returning: true,
        });
        if (updateUser) {
          return res.status(200).json({code:'200', message:'OK', data:updateUser });
        }
      } else if (!userDataById) {
        res.status(404).json({code:'200', message:'OK', msg: 'user not found!', data :id });
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    const { id } = req.params;
    try {
      const deleteUser = await User.destroy({
        where: { id: id },
        returning: true,
      });
      if (deleteUser) {
        return res.status(200).json({code:'200', message: `success delete user with id ${id}`, data:id });
      } else {
        return res.status(404).json({code:'500',  message: `failed, delete user with id ${id} not found` });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
