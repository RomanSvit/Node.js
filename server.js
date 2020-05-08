const express = require("express");
const mongoose = require("mongoose");
const contactsRouters = require("./api/routers");
const userRouters = require("./users/userRoutes")
require("dotenv").config();
const server = express();

module.exports = class UserServer {
  constructor() {
    this.server = null;
  }
  start() {
    this.initServer();
    this.initMiddlwares();
    this.initRoutes();
    this.initDataBase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }
  initMiddlwares() {
    this.server.use(express.json());
    this.server.use(express.static("public"));
    this.server.use(express.static("tmp"));
  }
  initRoutes() {
    this.server.use("/api/contacts", contactsRouters);
    this.server.use("/", userRouters);
  }

  async initDataBase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL2, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
      console.log("Database connected!!!");
    } catch (error) {
      console.log(error);
    }

    mongoose.connection.on("error", (err) => {
      logError(err);
      process.exit(1);
    });
  }

  startListening() {
    const PORT = process.env.PORT;
    this.server.listen(PORT, () => {
      console.log("Server started listening on port", PORT);
    });
  }
};
