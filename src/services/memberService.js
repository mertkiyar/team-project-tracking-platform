const db = require("../config/database");

const memberService = {
    getAll() {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT pm.*, users.name, users.email, users.department
                FROM project_members pm
                JOIN users ON pm.user_id = users.id`,
                [],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    getById(id) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT pm.*, users.name, users.email, users.department
                FROM project_members pm
                JOIN users ON pm.user_id = users.id
                WHERE pm.id = ?`,
                [id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    },

    getByProject(projectId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT pm.*, users.name, users.email, users.department
                FROM project_members pm
                JOIN users ON pm.user_id = users.id
                WHERE pm.project_id = ?`,
                [projectId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    create(data) {
        const { project_id, user_id, project_role } = data;
        return new Promise((resolve, reject) => {
            if (!project_id || !user_id || !project_role) {
                return reject(new Error("project_id, user_id and project_role are required"));
            }
            db.run(
                "INSERT INTO project_members (project_id, user_id, project_role) VALUES (?, ?, ?)",
                [project_id, user_id, project_role],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...data });
                }
            );
        });
    },

    update(id, data) {
        const { project_role } = data;
        return new Promise((resolve, reject) => {
            db.run(
                "UPDATE project_members SET project_role = ? WHERE id = ?",
                [project_role, id],
                function (err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                }
            );
        });
    },

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM project_members WHERE id = ?", [id], function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    add(data) {
        return this.create(data);
    },

    remove(id) {
        return this.delete(id);
    },
};

module.exports = memberService;
