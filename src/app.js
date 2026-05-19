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

const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

const memberRoutes = require("./routes/memberRoutes");
app.use("/api/members", memberRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

//swagger conf
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Team Project Tracking API",
            version: "1.0.0",
            description: "API documentation for the tracking platform"
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: "Local server"
            }
        ]
    },
    apis: ["./src/routes/*.js", "./src/app.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
