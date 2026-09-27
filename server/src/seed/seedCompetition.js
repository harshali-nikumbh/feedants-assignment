const mongoose = require("mongoose");
const Competition = require("../models/Competition");
require("dotenv").config();

const seedCompetition = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    await Competition.deleteMany({});

    const competition = await Competition.create({
      title: "Feedants Classical Dance",
      category: "Dance",
      type: "Multi-Win",

      prizePool: 1500,
      entryFee: 99,

      maxParticipants: 20,
      registeredParticipants: 1,

      // Demo dates — kept future-facing so we can demonstrate
      // registration, submission and result states.
      registrationStart: new Date("2026-09-20T00:00:00+05:30"),
      registrationEnd: new Date("2026-10-05T23:50:00+05:30"),

      submissionStart: new Date("2026-09-25T04:00:00+05:30"),
      submissionEnd: new Date("2026-10-10T23:55:00+05:30"),

      resultDate: new Date("2026-10-15T23:50:00+05:30"),

      status: "registration_open",

      certificateAvailable: true,

      judge: {
        name: "Manju Dubey",
        profession: "Professional Kathak Dancer",
        experience: "12+ Years of Experience",
        image: "",
        introVideo: "",
      },

      about:
        "This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.",

      judgingParameters: [
        "Technique and precision",
        "Expression and presentation",
        "Rhythm and musicality",
        "Creativity",
      ],

      rules: [
        "Participants must submit their own performance.",
        "The submitted performance should follow the competition category.",
        "Only registered participants can submit an entry.",
        "Submissions must be uploaded before the submission deadline.",
      ],

      rewards: [
        { position: "1st Winner", amount: 550 },
        { position: "2nd Winner", amount: 300 },
        { position: "3rd Winner", amount: 240 },
        { position: "4th Winner", amount: 200 },
        { position: "5th Winner", amount: 130 },
        { position: "6th Winner", amount: 80 },
      ],

      previousWinners: [
        {
          name: "Riya Shah",
          position: "1st Winner",
          image: "",
        },
        {
          name: "Aarav Mehta",
          position: "1st Winner",
          image: "",
        },
        {
          name: "Neha Verma",
          position: "2nd Winner",
          image: "",
        },
        {
          name: "Ishita Choudhary",
          position: "3rd Winner",
          image: "",
        },
      ],
    });

    console.log("Competition created successfully:");
    console.log(competition);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedCompetition();