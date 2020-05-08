const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("./userModel");

const path = require("path");
const fs = require("fs");
const { promises: fsPromises } = require("fs");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

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
      const newAvatar = `avatar_${Date.now()}.png`;
      avatar
        .create("gabriel")
        .then((buffer) => fs.writeFileSync(`./tmp/${newAvatar}`, buffer));
      const userPassword = await bcrypt.hash(password, this._costFactor);
      const newUser = await userModel.create({
        email,
        password: userPassword,
        avatarURL: `${process.env.BASE_URL}/${newAvatar}`,
        subscription,
      });
      res.status(201).json({
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatarURL: newUser.avatarURL,
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
          avatarURL: user.avatarURL,
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
  async minifyImg(req, res, next) {
    try {
      const parsedUrl = req.user.avatarURL.split("/");
      const oldAvatar = parsedUrl[parsedUrl.length - 1];
      await fsPromises.unlink(`tmp/${oldAvatar}`);

      await imagemin([`tmp/${req.file.filename}`], {
        destination: "public/images",
        plugins: [
          imageminJpegtran(),
          imageminPngquant({
            quality: [0.6, 0.8],
          }),
        ],
      });

      const { filename, path: tmpPath } = req.file;
      req.file.path = path.join(__dirname, "..", "public", "images", filename);
      req.file.destination = path.join(__dirname, "..", "public", "images");
      await fsPromises.unlink(tmpPath);
      next();
    } catch (err) {
      next(err);
    }
  }

  async changeAvatar(req, res, next) {
    try {
      await userModel.findByIdAndUpdate(req.user._id, {
        avatarURL: req.file.path,
      });
      res.status(201).json({ message: "Avatar changed" });
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new UserController();
