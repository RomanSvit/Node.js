const { Router } = require("express");
const router = Router();
const { listContacts } = require("../contacts");
// GET /api/contacts
// ничего не получает
// вызывает функцию listContacts для работы с json-файлом contacts.json
// возвращает массив всех контактов в json-формате со статусом 200
router.get("/contacts", (req, res) => {
  res.status("200");
  res.json(listContacts());
});

module.exports = router;
