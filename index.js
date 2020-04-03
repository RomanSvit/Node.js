const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const argv = require("yargs");
require("dotenv").config();

const routContacts = require("./routes/contacts")
const routContactsId = require("./routes/contactId")
const routPostContact = require("./routes/postContacts")


const invokeAction = argv()
const app = express();

app.use("/api", routContacts, routContactsId, routPostContact);

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => {
  console.log("Server has been started on port -", PORT);
});

// invokeAction(argv);