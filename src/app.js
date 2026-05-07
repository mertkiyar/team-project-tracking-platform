require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/database");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/api", (req, res) => {
    res.json({ message: "API is running" });
});

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
