const { Router } = require("express");
const router = Router();
const CocntactController = require("../controlers");
// const { getContactById } = require("../controlers");
// @ GET /api/contacts/:contactId
// Не получает body
// Получает параметр contactId
// вызывает функцию getById для работы с json-файлом contacts.json
// если такой id есть, возвращает обьект контакта в json-формате со статусом 200
// если такого id нет, возвращает json с ключом "message": "Not found" и статусом 404
router.get("/contacts/:contactId", (req, res) => {
  const id = Number(req.params.contactId);
  const contactById = CocntactController.getContactById(id);
  if (contactById) {
    res.status("200").json(contactById);
  } else {
    res.status("404").json({ message: "Not found" });
  }
});

module.exports = router;
