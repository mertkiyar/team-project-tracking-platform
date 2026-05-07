const express = require("express");
const router = express.Router();
const projectService = require("../services/projectService");

// GET /api/projects
router.get("/", async (req, res) => {
    try {
        const projects = await projectService.getAll();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/projects/:id
router.get("/:id", async (req, res) => {
    try {
        const project = await projectService.getById(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/projects
router.post("/", async (req, res) => {
    console.log("BODY:", req.body);
    try {
        const project = await projectService.create(req.body);
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/projects/:id
router.put("/:id", async (req, res) => {
    try {
        const result = await projectService.update(req.params.id, req.body);
        if (result.changes === 0) return res.status(404).json({ error: "Project not found" });
        res.json({ message: "Project updated" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//DELETE /api/projects/:id
router.delete("/:id", async (req, res) => {
    try {
        const result = await projectService.delete(req.params.id);
        if (result.changes === 0) return res.status(404).json({ error: "Project not found" });
        res.json({ message: "Project deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//GET /api/projects/search?q=...
router.get("/search", async (req, res) => {
    try {
        const projects = await projectService.search(req.query.q);
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;