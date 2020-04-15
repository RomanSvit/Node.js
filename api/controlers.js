const Joi = require("joi");
const contactModel = require("./model");
const {
  Types: { ObjectId },
} = require("mongoose");

class CocntactController {
  async listContacts(req, res, next) {
    try {
      const contacts = await contactModel.find();
      res.status(201).json(contacts);
    } catch (err) {
      next(err);
    }
  }
  async getContactById(req, res, next) {
    try {
      const { contactId } = req.params.id;
      if (!ObjectId.isValid(contactId)) {
        res.status("400").send();
      }
      const contact = await contactModel.findById(contactId);
      if (!contact) {
        res.status("400").send();
      }
      res.status("200").json(contactById);
    } catch (err) {
      next(err);
    }
  }
  async addContact() {
    try {
      const newContact = await contactModel.save(req.body);
      return res.status(201).json(newContact);
    } catch (err) {
      next(err);
    }
  }
  removeContact() {}
  updateContact() {}
}
module.exports = new CocntactController();
