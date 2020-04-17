const { Router } = require("express");
const CocntactController = require("./controlers");

const router = Router();

router.get("/", CocntactController.listContacts);
router.get(
  "/:contactId",
  CocntactController.validateId,
  CocntactController.getContactById
);
router.post("", CocntactController.addContact);
router.delete(
  "/:contactId",
  CocntactController.validateId,
  CocntactController.removeContact
);
router.patch(
  "/:contactId",
  CocntactController.validateId,
  CocntactController.updateContact
);

module.exports = router;
