const express = require("express");
const router = express.Router();
const taskService = require("../services/taskService");

// GET /api/tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await taskService.getAll();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/tasks/:id
router.get("/:id", async (req, res) => {
    try {
        const task = await taskService.getById(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/tasks
router.post("/", async (req, res) => {
    console.log("BODY:", req.body);
    try {
        const task = await taskService.create(req.body);
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
    try {
        const result = await taskService.update(req.params.id, req.body);
        if (result.changes === 0) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task updated" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
    try {
        const result = await taskService.delete(req.params.id);
        if (result.changes === 0) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//GET /api/tasks/filter?status=todo&priority=high
router.get("/filter", async (req, res) => {
    try {
        const tasks = await taskService.filter(req.query);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;