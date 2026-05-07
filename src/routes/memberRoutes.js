const express = require("express");
const router = express.Router();
const memberService = require("../services/memberService");

// GET /api/members
router.get("/", async (req, res) => {
    try {
        const members = await memberService.getAll();
        res.json(members);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/members/:id
router.get("/:id", async (req, res) => {
    try {
        const member = await memberService.getById(req.params.id);
        if (!member) return res.status(404).json({ error: "Project Member not found" });
        res.json(member);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/members
router.post("/", async (req, res) => {
    console.log("BODY:", req.body);
    try {
        const member = await memberService.create(req.body);
        res.status(201).json(member);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/members/:id
router.put("/:id", async (req, res) => {
    try {
        const result = await memberService.update(req.params.id, req.body);
        if (result.changes === 0) return res.status(404).json({ error: "Project Member not found" });
        res.json({ message: "Project Member updated" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//DELETE /api/members/:id
router.delete("/:id", async (req, res) => {
    try {
        const result = await memberService.delete(req.params.id);
        if (result.changes === 0) return res.status(404).json({ error: "Project Member not found" });
        res.json({ message: "Project Member deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;