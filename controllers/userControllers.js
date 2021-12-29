const { User } = require('../models');
const { comparePassword, hashPassword } = require('../helpers/bcrypt');
const { generateAccessToken } = require('../helpers/jwt');
class UserController {
  static async list(req, res) {
    let data = await User.findAll();
    try {
      if (data) {
        return res.status(200).json({ users: data });
      } else {
        return res.status(500).json({ message: 'user table empty' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async register(req, res) {
    let inputDataRegister = {
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      type: req.body.type,
      address: req.body.address,
      region: req.body.region,
      gender: req.body.gender,
      password: req.body.password,
    };

    User.create(inputDataRegister, {})
      .then((data) => {
        return res.status(201).json({ data });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });
  }

  static async login(req, res) {
    const inputLogin = {
      email: req.body.email,
      password: req.body.password,
    };

    const user = await User.findOne({
      where: { email: inputLogin.email },
    });

    const userId = user?.dataValues?.id;

    try {
      if (!user) {
        return res.status(400).json({ message: 'failed, user not registered' });
      } else if (!comparePassword(inputLogin.password, user.dataValues.password)) {
        return res.status(401).json({ msg: 'email or password wrong!' });
      } else {
        const accessToken = generateAccessToken({
          email: user.email,
          password: user.password,
        });
        return res.status(200).json({ accessToken, userId });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const inputDataUpdate = {
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      type: req.body.type,
      address: req.body.address,
      region: req.body.region,
      gender: req.body.gender,
      password: hashPassword(req.body.password),
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
          return res.status(200).json({ updateUser });
        }
      } else if (!userDataById) {
        res.status(404).json({ msg: 'user not found!' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const deleteUser = await User.destroy({
        where: { id: id },
        returning: true,
      });
      if (deleteUser) {
        return res.status(200).json({ message: `success delete user with id ${id}` });
      } else {
        return res.status(404).json({ message: `failed, delete user with id ${id} not found` });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserController;
