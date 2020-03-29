const argv = require("yargs").argv;
const contactsMethods = require("./contacts");

const listContacts = contactsMethods.listContacts;
const getContactById = contactsMethods.getContactById;
const addContact = contactsMethods.addContact;
const removeContact = contactsMethods.removeContact;
// TODO: рефакторить
function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      console.table(listContacts());
      break;

    case "get":
      console.table(getContactById(id));
      break;

    case "add":
      addContact({ name, email, phone });
      console.table(listContacts());
      break;

    case "remove":
      removeContact(id);
      console.table(listContacts());
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);
