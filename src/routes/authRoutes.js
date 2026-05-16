const express = require("express");
const router = express.Router();
const authService = require("../services/authService");

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await authService.login(email, password);
        res.json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

module.exports = router;
