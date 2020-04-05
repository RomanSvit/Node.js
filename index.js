const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const argv = require("yargs");
const bodyParser = require("body-parser");
require("dotenv").config();

const routContacts = require("./routes/contacts")
const routContactsId = require("./routes/contactId")
const routPostContact = require("./routes/postContacts")
const routDelete = require("./routes/deleteRout")
const routPatchUp = require("./routes/pathcRout")

const app = express();
app.use(bodyParser.json());

app.use(
  "/api",
  routContacts,
  routContactsId,
  routPostContact,
  routDelete,
  routPatchUp
);

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => {
  console.log("Server has been started on port -", PORT);
});
