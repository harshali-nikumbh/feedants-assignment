const express = require("express");

const {
  createRegistration,
  getRegistration,
} = require("../controllers/registration.controller");

const router = express.Router();

router.post("/", createRegistration);
router.get("/", getRegistration);

module.exports = router;