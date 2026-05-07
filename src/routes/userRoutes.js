const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

// GET /api/users
router.get("/", async (req, res) => {
    try {
        const users = await userService.getAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users/:id
router.get("/:id", async (req, res) => {
    try {
        const user = await userService.getById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/users
router.post("/", async (req, res) => {
    console.log("BODY:", req.body);
    try {
        const user = await userService.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/users/:id
router.put("/:id", async (req, res) => {
    try {
        const result = await userService.update(req.params.id, req.body);
        if (result.changes === 0) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User updated" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
    try {
        const result = await userService.delete(req.params.id);
        if (result.changes === 0) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;