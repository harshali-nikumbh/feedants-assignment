const express = require("express");

const {
  getCompetitionById,
} = require("../controllers/competition.controller");

const router = express.Router();

router.get("/:id", getCompetitionById);

module.exports = router;