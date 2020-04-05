const { Router } = require("express");
const { addContact}  = require("../contacts");
const bodyParser = require("body-parser");
const Joi = require("joi");
const router = Router();
const jsonParser = bodyParser.json();
// POST /api/contacts
// Получает body в формате {name, email, phone}
// Если в body нет каких-то обязательных полей, возарщает json с ключом {"message": "missing required name field"} и статусом 400
// Если с body все хорошо, добавляет уникальный идентификатор в обьект контакта
// Вызывает функцию addContact() для сохранения контакта в файле contacts.json
// По результату работы функции возвращает обьект с добавленным id {id, name, email, phone} и статусом 201

router.post("/contacts",jsonParser, (req, res, next) => {
  const data = req.body;
  console.log(data);
  const paramNewContact = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required()
  });
  Joi.validate(data, paramNewContact, (err, value) => {
    if (err) {
      res.status("400").json({ message: "missing required name field" });
    } else {
      const newContact = addContact(data);
      res.status("201");
      res.json(newContact);
    }
  });
});

module.exports = router;
