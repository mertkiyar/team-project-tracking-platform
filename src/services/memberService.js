const db = require("../config/database");

const memberService = {
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

    add(data) {
        const { project_id, user_id, project_role } = data;
        return new Promise((resolve, reject) => {
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

    remove(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM project_members WHERE id = ?", [id], function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },
};

module.exports = memberService;
