const { Router } = require("express");
const bodyParser = require("body-parser");
const router = Router();
const Joi = require("joi");
const jsonParser = bodyParser.json();
const { updateContact, getContactById } = require("../contacts");
// PATCH /api/contacts/:contactId
// Получает body в json-формате c обновлением любых полей name, email и phone
// Если body нет, возарщает json с ключом {"message": "missing fields"} и статусом 400
// Если с body все хорошо, вызывает функцию updateContact(id) (напиши ее) для обновления контакта в файле contacts.json
// По результату работы функции возвращает обновленный обьект контакта и статусом 200. В противном случае, возвращает json с ключом "message": "Not found" и статусом 404
router.patch("/contacts/:contactId", jsonParser, (req, res, next) => {
  const data = req.body;
  const paramNewContact = Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  });
  Joi.validate(data, paramNewContact, (err, value) => {
    if (err) {
      res.status("400").json({ message: "missing required name field" });
    } else {
      if (Object.keys(data).length === 0) {
        res.status(400).json({ message: "missing fields" });
      } else {
        const id = Number(req.params.contactId);
        const newData = { id: id, ...data };
        const contactById = getContactById(id);
        if (contactById) {
          const update = updateContact(newData);
          res.status(200).json(update);
        } else {
          res.status(404).json({ message: "Not found" });
        }
      }
    }
  });
});

module.exports = router;
