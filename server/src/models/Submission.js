const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },

    participantName: {
      type: String,
      required: true,
      trim: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["submitted", "under_review", "evaluated"],
      default: "submitted",
    },
  },
    {
    timestamps: true,
  }
);

submissionSchema.index(
  { competition: 1, participantName: 1 },
  { unique: true }
);

module.exports = mongoose.model("Submission", submissionSchema);