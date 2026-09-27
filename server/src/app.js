const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
require("dotenv").config();
const competitionRoutes = require("./routes/competition.routes");
const submissionRoutes = require("./routes/submission.routes");
const registrationRoutes = require("./routes/registration.routes");

const app = express();
app.use("/uploads", express.static("uploads"));

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/competitions", competitionRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/registrations", registrationRoutes);


app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Feedants backend is running",
  });
});

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});