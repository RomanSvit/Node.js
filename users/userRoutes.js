const { Router } = require("express");
const UserController = require("./userControlers");

const router = Router();

router.post(
  "/auth/register",
  UserController.validateCreateUser,
  UserController.createUser
);
router.post("/auth/login", UserController.validateLogin, UserController.userLogin);
// router.post("/auth/logout", UserController.verifyToken, UserController.logout);
// router.get("/current", UserController.verifyToken, UserController.getUser);

module.exports = router;
