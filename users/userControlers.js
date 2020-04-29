const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("./userModel");
const {
  Types: { ObjectId },
} = require("mongoose");

class UserController {
  constructor() {
    this._costFactor = 4;
  }

  get createUser() {
    return this._createUser.bind(this);
  }

  // function create new user
  async _createUser(req, res, next) {
    try {
      const { email, password, subscription } = req.body;
      const currentEmail = await userModel.findOne({ email });
      if (currentEmail) {
        return res.status("400").json({ message: "Email in use" });
      }
      const userPassword = await bcrypt.hash(password, this._costFactor);
      const newUser = await userModel.create({
        email,
        password: userPassword,
        subscription,
      });
      res.status(201).json({
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async userLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      // console.log(user);
      if (!user) {
        res.status(401).json({ message: "Authentication failed" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Неверный логин или пароль" });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      await userModel.findByIdAndUpdate(user._id, { $set: { token } });
      res.status(200).json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyUserToken(req, res, next) {
    const authorizationHeader = req.get("Authorization");
    if (!authorizationHeader) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const token = authorizationHeader.replace("Bearer ", "");
    try {
      const userId = jwt.verify(token, process.env.JWT_SECRET).id;
      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        return res.status(401).json({ message: "Not authorized" });
      }
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  async validateCreateUser(req, res, next) {
    try {
      const userRules = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string()
          .regex(/^[a-zA-Z0-9]{4,12}$/)
          .required(),
        subscription: Joi.string(),
      });

      await Joi.validate(req.body, userRules);
      next();
    } catch (err) {
      res.status(422).json({ message: "Missing required fields" });
    }
  }
  async validateLogin(req, res, next) {
    try {
      const loginRules = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string()
          .regex(/^[a-zA-Z0-9]{4,12}$/)
          .required(),
      });
      await Joi.validate(req.body, loginRules);
      next();
    } catch (err) {
      res.status(422).json({ message: "Missing required fields" });
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;
      await userModel.findByIdAndUpdate(user._id, { token: null });
      res.status(200).json({ message: "Logout success" });
    } catch (err) {
      next(err);
    }
  }
  async getCurrentUser(req, res, next) {
    try {
      const userId = req.user._id;
      const user = await userModel.findById(userId);
      res
        .status(200)
        .json({ email: user.email, subscription: user.subscription });
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new UserController();
