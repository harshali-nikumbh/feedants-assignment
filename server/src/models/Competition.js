const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const winnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    prizePool: {
      type: Number,
      required: true,
      min: 0,
    },

    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },

    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },

    registeredParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },

    registrationStart: {
      type: Date,
      required: true,
    },

    registrationEnd: {
      type: Date,
      required: true,
    },

    submissionStart: {
      type: Date,
      required: true,
    },

    submissionEnd: {
      type: Date,
      required: true,
    },

    resultDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "upcoming",
        "registration_open",
        "registration_closed",
        "submission_open",
        "submission_closed",
        "result_declared",
        "cancelled",
      ],
      default: "upcoming",
    },

    certificateAvailable: {
      type: Boolean,
      default: false,
    },

    judge: {
      name: {
        type: String,
        required: true,
      },
      profession: {
        type: String,
        required: true,
      },
      experience: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        default: "",
      },
      introVideo: {
        type: String,
        default: "",
      },
    },

    about: {
      type: String,
      required: true,
    },

    judgingParameters: {
      type: [String],
      default: [],
    },

    rules: {
      type: [String],
      default: [],
    },

    rewards: {
      type: [rewardSchema],
      default: [],
    },

    previousWinners: {
      type: [winnerSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Competition", competitionSchema);