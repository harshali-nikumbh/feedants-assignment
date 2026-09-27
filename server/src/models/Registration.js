const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
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

    status: {
      type: String,
      enum: ["registered", "cancelled"],
      default: "registered",
    },
  },
  {
    timestamps: true,
  }
);

// A participant can register only once for a competition
registrationSchema.index(
  { competition: 1, participantName: 1 },
  { unique: true }
);

module.exports = mongoose.model("Registration", registrationSchema);