const express = require("express");
const router = express.Router();
const { sendRequest, getMyRequests, respondToRequest, deleteRequest } = require("../controllers/requestController");
const isAuth = require("../middleware/isAuth");

router.post("/", isAuth, sendRequest);
router.get("/", isAuth, getMyRequests);
router.put("/:id", isAuth, respondToRequest);
router.delete("/:id", isAuth, deleteRequest);

module.exports = router;