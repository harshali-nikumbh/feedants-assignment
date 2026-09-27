const Competition = require("../models/Competition");

const getCompetitionById = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Competition not found",
      });
    }

    res.json({
      success: true,
      data: competition,
    });
  } catch (error) {
    console.error("Error fetching competition:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch competition",
    });
  }
};

module.exports = {
  getCompetitionById,
};