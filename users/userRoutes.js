const { Router } = require("express");
const UserController = require("./userControlers");
const path = require("path");
const multer = require("multer");
const router = Router();

const storage = multer.diskStorage({
  destination: "tmp",
  filename: function (req, file, cb) {
    const ext = path.parse(file.originalname).ext;
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });
router.patch(
  "/avatars",
  // UserController.verifyUserToken,
  upload.single("avatar"),
  UserController.minifyImg,
  UserController.changeAvatar
);
router.post(
  "/auth/register",
  UserController.validateCreateUser,
  UserController.createUser
);
router.post(
  "/auth/login",
  UserController.validateLogin,
  UserController.userLogin
);
router.post(
  "/auth/logout",
  UserController.verifyUserToken,
  UserController.logout
);
router.get(
  "/current",
  UserController.verifyUserToken,
  UserController.getCurrentUser
);


module.exports = router;
