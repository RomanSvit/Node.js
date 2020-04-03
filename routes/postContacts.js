const { Router } = require("express");
const { addContact } = require("../contacts");
const Joi = require("joi");
const router = Router();
// POST /api/contacts
// Получает body в формате {name, email, phone}
// Если в body нет каких-то обязательных полей, возарщает json с ключом {"message": "missing required name field"} и статусом 400
// Если с body все хорошо, добавляет уникальный идентификатор в обьект контакта
// Вызывает функцию addContact() для сохранения контакта в файле contacts.json
// По результату работы функции возвращает обьект с добавленным id {id, name, email, phone} и статусом 201
router.post("/contacts", validateParams, (req, res, next) => {
  const data = req.body;
  const newContact = addContact(data);
  res.status("201");
  res.json(newContact);
});
function validateParams(req, res, next) {
  const paramNewContact = Joi.object({
    id: Joi.number(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required()
  });
  const valedateResult = Joi.validate(req.query, paramNewContact);
  if (valedateResult.error) {
    return res.status("400").json({ message: "missing required name field" });
  }
  next();
}
module.exports = router;
