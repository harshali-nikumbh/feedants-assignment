const Registration = require("../models/Registration");
const Competition = require("../models/Competition");

const createRegistration = async (req, res) => {
  try {
    const { competitionId, participantName } = req.body;

    // 1. Validate input
    if (!competitionId || !participantName) {
      return res.status(400).json({
        success: false,
        message: "Competition ID and participant name are required",
      });
    }

    // 2. Find competition
    const competition = await Competition.findById(competitionId);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Competition not found",
      });
    }

 // 3. Check registration window
const now = new Date();

if (now < competition.registrationStart) {
  return res.status(400).json({
    success: false,
    message: "Registration has not started yet",
  });
}

if (now > competition.registrationEnd) {
  return res.status(400).json({
    success: false,
    message: "Registration has ended",
  });
}



    // 5. Check duplicate registration
    const existingRegistration = await Registration.findOne({
      competition: competitionId,
      participantName,
      status: "registered",
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: "You are already registered for this competition",
      });
    }


    // 6. Atomically reserve a participant spot
    let spotReserved = false;
const updatedCompetition = await Competition.findOneAndUpdate(
  {
    _id: competitionId,
    registeredParticipants: {
      $lt: competition.maxParticipants,
    },
  },
  {
    $inc: {
      registeredParticipants: 1,
    },
  },
  {
    new: true,
  }
);

if (!updatedCompetition) {
  return res.status(400).json({
    success: false,
    message: "No spots available for this competition",
  });
}

spotReserved = true;


    // 7. Create registration
    let registration;

try {
  registration = await Registration.create({
    competition: competitionId,
    participantName,
  });
} catch (error) {
  if (spotReserved) {
    await Competition.findByIdAndUpdate(
      competitionId,
      { $inc: { registeredParticipants: -1 } }
    );
  }

  throw error;
}


    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: registration,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handles MongoDB unique index violation
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You are already registered for this competition",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to register for competition",
    });
  }
};


const getRegistration = async (req, res) => {
  try {
    const { competitionId, participantName } = req.query;

    if (!competitionId || !participantName) {
      return res.status(400).json({
        success: false,
        message: "Competition ID and participant name are required",
      });
    }

    const registration = await Registration.findOne({
      competition: competitionId,
      participantName,
      status: "registered",
    });

    return res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Get registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch registration",
    });
  }
};


module.exports = {
  createRegistration,
  getRegistration,
};