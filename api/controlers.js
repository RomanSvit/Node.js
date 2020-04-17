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
  // function find contact by id
  async getContactById(req, res, next) {
    try {
      const { contactId } = req.params;
      const contact = await contactModel.findById(contactId);
      if (!contact) {
        return res.status("400").send();
      }
      return res.status("200").json(contactById);
    } catch (err) {
      next(err);
    }
  }
  // function add contact and save
  async addContact(req, res, next) {
    try {
      const newContact = await contactModel.save(req.body);
      return res.status(201).json(newContact);
    } catch (err) {
      next(err);
    }
  }
  // function remove contact by id
  async removeContact(req, res, next) {
    const { contactId } = req.params;
    try {
      const curentContact = await contactModel.findByIdAndDelete(contactId);
      if (!curentContact) {
        return res.status(404).send();
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
  async updateContact(req, res, next) {
    const { contactId } = req.params;
    try {
      if (Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "missing fields" });
      } else {
        const curentContact = await contactModel.findByIdAndUpdate(
          contactId,
          req.body,
          { new: true }
        );
        if (!curentContact) {
          return res.status(404).send();
        }
        return res.status(200).json(curentContact);
      }
    } catch (err) {
      next(err);
    }
  }
  async validateId(req, res, next) {
    const { contactId } = req.params;
    if (!ObjectId.isValid(contactId)) {
      return res.status("400").send();
    }
    next();
  }
}
module.exports = new CocntactController();
