const express = require("express");
const router = express.Router();
const projectService = require("../services/projectService");

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     description: Returns a list of all projects.
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Successful. Returns a list of projects.
 */
// GET /api/projects
router.get("/", async (req, res) => {
    try {
        const projects = await projectService.getAll();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get a single project
 *     description: Returns a project by its ID.
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful. Project details returned.
 *       404:
 *         description: Project not found.
 */
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

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create project
 *     description: Adds a new project.
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 example: "2024-01-01"
 *               end_date:
 *                 type: string
 *                 example: "2024-12-31"
 *     responses:
 *       201:
 *         description: Project created successfully.
 */
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

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     description: Updates project details by ID.
 *     tags: [Projects]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully.
 *       404:
 *         description: Project not found.
 */
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

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     description: Removes a project. Fails if there are active tasks.
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted successfully.
 *       400:
 *         description: Project cannot be deleted (e.g., has active tasks).
 *       404:
 *         description: Project not found.
 */
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

/**
 * @swagger
 * /api/projects/search:
 *   get:
 *     summary: Search projects
 *     description: Search projects by a query string.
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search text
 *     responses:
 *       200:
 *         description: List of matched projects.
 */
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
