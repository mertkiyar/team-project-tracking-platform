const express = require("express");
const router = express.Router();
const taskService = require("../services/taskService");

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Returns a list of all tasks.
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A list of tasks.
 */
// GET /api/tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await taskService.getAll();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/tasks/filter:
 *   get:
 *     summary: Filter tasks
 *     description: Filter tasks by status, priority, etc.
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of filtered tasks.
 */
// GET /api/tasks/filter?status=todo&priority=high
router.get("/filter", async (req, res) => {
    try {
        const tasks = await taskService.filter(req.query);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Returns details of a specific task.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task details.
 *       404:
 *         description: Task not found.
 */
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

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     description: Adds a new task to a project.
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 example: "todo"
 *               priority:
 *                 type: string
 *                 example: "medium"
 *               project_id:
 *                 type: integer
 *               assigned_to:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Task created successfully.
 *       403:
 *         description: User is not a member of the project.
 */
// POST /api/tasks
router.post("/", async (req, res) => {
    console.log("BODY:", req.body);
    try {
        const { assigned_to, project_id } = req.body;
        if (assigned_to && project_id) {
            const isMember = await taskService.validateUserInProject(assigned_to, project_id);
            if (!isMember) {
                return res.status(403).json({ error: "User is not a member of this project" });
            }
        }

        const task = await taskService.create(req.body);
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Updates an existing task's details.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               project_id:
 *                 type: integer
 *               assigned_to:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *       403:
 *         description: User is not a member of the project.
 *       404:
 *         description: Task not found.
 */
// PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
    try {
        const { assigned_to, project_id } = req.body;
        if (assigned_to && project_id) {
            const isMember = await taskService.validateUserInProject(assigned_to, project_id);
            if (!isMember) {
                return res.status(403).json({ error: "User is not a member of this project" });
            }
        }

        const result = await taskService.update(req.params.id, req.body);
        if (result.changes === 0) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task updated" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Removes a task by ID.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *       404:
 *         description: Task not found.
 */
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

module.exports = router;
