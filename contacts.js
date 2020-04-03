const path = require("path");
const fs = require("fs");

const contactsPath = path.join(__dirname, "db", "contacts.json");

function listContacts() {
  return JSON.parse(
    fs.readFileSync(contactsPath, "utf-8", async err => {
      if (err) throw new Error(err);
    })
  );
}

function getContactById(contactId) {
  const contacts = listContacts();

  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].id === contactId) {
      console.log(`Contact with id:${contactId} was find!`);
      return contacts[i];
    }
  }
  console.log(`Contact with id:${contactId} is undefined!`);
  return null;
}

function addContact(data = {name, email, phone}) {
  const contacts = listContacts();
  const newContact = { id: contacts.length + 1, ...data };

  fs.writeFileSync(
    contactsPath,
    JSON.stringify([...contacts, newContact]),
    err => {
      if (err) throw new Error(err);
    }
  );

  console.log("Contact has been added!");
}
function removeContact(contactId) {
  const contacts = listContacts();
  const newContacts = [];
  let currentId = 0;

  if (getContactById(contactId) === null) return null;

  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].id !== contactId) {
      newContacts.push({ ...contacts[i], id: (currentId += 1) });
    }
  }

  fs.writeFileSync(contactsPath, JSON.stringify(newContacts), err => {
    if (err) throw new Error(err);
  });
  console.log(`Contact with id:${contactId} was remove!`);
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact
};
