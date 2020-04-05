const { Router } = require("express");
const { getContactById, removeContact } = require("../contacts");
const bodyParser = require("body-parser");
const router = Router();
// DELETE /api/contacts/:contactId
// Не получает body
// Получает параметр contactId
// вызывает функцию removeContact для работы с json-файлом contacts.json
// если такой id есть, возвращает json формата {"message": "contact deleted"} и статусом 200
// если такого id нет, возвращает json с ключом "message": "Not found" и статусом 404
router.delete("/contacts/:contactId", async (req, res) => {
  const id = await Number(req.params.contactId);
  const contactById = getContactById(id);

  if (contactById) {
    const newContacts = removeContact(id);
    res.status("200").json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;
