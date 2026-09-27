const Submission = require("../models/Submission");
const Competition = require("../models/Competition");
const Registration = require("../models/Registration");

const createSubmission = async (req, res) => {
  try {
    const { competitionId, participantName } = req.body;

    if (!competitionId || !participantName) {
      return res.status(400).json({
        success: false,
        message: "Competition and participant name are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Submission file is required",
      });
    }

    const competition = await Competition.findById(competitionId);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Competition not found",
      });
    }


    const registration = await Registration.findOne({
  competition: competitionId,
  participantName,
  status: "registered",
});

if (!registration) {
  return res.status(403).json({
    success: false,
    message: "You must register for this competition before submitting",
  });
}


    const existingSubmission = await Submission.findOne({
  competition: competitionId,
  participantName,
});

if (existingSubmission) {
  return res.status(409).json({
    success: false,
    message: "You have already submitted for this competition",
  });
}

    const now = new Date();

    if (now < competition.submissionStart) {
  return res.status(400).json({
    success: false,
    message: "Submission has not started yet",
  });
}

    if (now > competition.submissionEnd) {
      return res.status(400).json({
        success: false,
        message: "Submission deadline has passed",
      });
    }

    let submission;

try {
  submission = await Submission.create({
    competition: competitionId,
    participantName,
    fileName: req.file.originalname,
    filePath: req.file.path,
    fileType: req.file.mimetype,
  });
} catch (error) {
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "You have already submitted for this competition",
    });
  }

  throw error;
}

    res.status(201).json({
      success: true,
      message: "Submission uploaded successfully",
      data: submission,
    });
  } catch (error) {
    console.error("Submission error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to upload submission",
    });
  }
};



const getSubmission = async (req, res) => {
  try {
    const { competitionId, participantName } = req.query;

    if (!competitionId || !participantName) {
      return res.status(400).json({
        success: false,
        message: "Competition and participant name are required",
      });
    }

    const submission = await Submission.findOne({
  competition: competitionId,
  participantName,
});

if (!submission) {
  return res.status(200).json({
    success: true,
    data: null,
  });
}

const relativePath = submission.filePath.replace(/\\/g, "/");

const fileName = relativePath.split("/").pop();

const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;

res.status(200).json({
  success: true,
  data: {
    ...submission.toObject(),
    fileUrl,
  },
});


  } catch (error) {
    console.error("Get submission error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch submission",
    });
  }
};


module.exports = {
  createSubmission,
  getSubmission,
};