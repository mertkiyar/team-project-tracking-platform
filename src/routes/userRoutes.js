const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 */
// GET /api/users
router.get("/", async (req, res) => {
    try {
        const users = await userService.getAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user
 *     description: Returns user details by ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details.
 *       404:
 *         description: User not found.
 */
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

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create user
 *     description: Creates a new user in the system.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: "Employee"
 *     responses:
 *       201:
 *         description: User created successfully.
 */
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

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     description: Updates an existing user by ID.
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       404:
 *         description: User not found.
 */
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

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Removes a user by ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
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
