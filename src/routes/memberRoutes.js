const express = require("express");
const router = express.Router();
const memberService = require("../services/memberService");

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Get all project members
 *     description: Returns a list of all project-member assignments.
 *     tags: [Members]
 *     responses:
 *       200:
 *         description: A list of members.
 */
// GET /api/members
router.get("/", async (req, res) => {
    try {
        const members = await memberService.getAll();
        res.json(members);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/members/{id}:
 *   get:
 *     summary: Get a member assignment by ID
 *     description: Returns details of a specific project membership.
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Member details.
 *       404:
 *         description: Member not found.
 */
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

/**
 * @swagger
 * /api/members:
 *   post:
 *     summary: Add a member to a project
 *     description: Assigns a user to a specific project.
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               project_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Member added successfully.
 */
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

/**
 * @swagger
 * /api/members/{id}:
 *   put:
 *     summary: Update a member assignment
 *     description: Updates a project-member assignment by ID.
 *     tags: [Members]
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
 *               project_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Member updated successfully.
 *       404:
 *         description: Member not found.
 */
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

/**
 * @swagger
 * /api/members/{id}:
 *   delete:
 *     summary: Remove a member assignment
 *     description: Removes a user from a project by membership ID.
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Member removed successfully.
 *       404:
 *         description: Member not found.
 */
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
