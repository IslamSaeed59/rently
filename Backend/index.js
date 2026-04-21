const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

app.use(express.static("dist"));
app.use(cors());

dotenv.config();

const authRoutes = require("./Src/Routes/authRoutes");

const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});
