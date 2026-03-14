const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateProfile, getConnections } = require("../controllers/userController");
const isAuth = require("../middleware/isAuth");

router.get("/", isAuth, getAllUsers);
router.get("/connections", isAuth, getConnections);
router.get("/:id", isAuth, getUserById);
router.put("/profile", isAuth, updateProfile);

module.exports = router;