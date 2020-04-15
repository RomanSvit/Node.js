const express = require("express");
const mongoose = require("mongoose");

const routContacts = require("./api/routes/contacts");
const routContactsId = require("./api/routes/contactId");
const routPostContact = require("./api/routes/postContacts");
const routDelete = require("./api/routes/deleteRout");
const routPatchUp = require("./api/routes/pathcRout");

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
  }
  initRoutes() {
    this.server.use(
      "/api",
      routContacts,
      routContactsId,
      routPostContact,
      routDelete,
      routPatchUp
    );
  }

  async initDataBase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL2, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
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
