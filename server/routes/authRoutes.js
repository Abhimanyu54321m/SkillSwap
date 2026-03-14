const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const isAuth = require("../middleware/isAuth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuth, getMe);

module.exports = router;