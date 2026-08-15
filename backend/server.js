const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully ✅");
  })
  .catch((error) => {
    console.log("MongoDB Connection Failed ❌");
    console.log(error.message);
  });

app.get("/", (req, res) => {
  res.send("DevPulse Backend is Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});