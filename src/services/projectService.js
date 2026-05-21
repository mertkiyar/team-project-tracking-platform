const db = require("../config/database");

const projectService = {
    getAll() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM projects", [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    getById(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM projects WHERE id = ?", [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    create(data) {
        const { title, description, status, start_date, end_date } = data;
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO projects (title, description, status, start_date, end_date) VALUES (?, ?, ?, ?, ?)",
                [title, description, status || "active", start_date, end_date],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, title, description, status, start_date, end_date });
                }
            );
        });
    },

    update(id, data) {
        const { title, description, status, start_date, end_date } = data;
        return new Promise((resolve, reject) => {
            db.run(
                "UPDATE projects SET title=?, description=?, status=?, start_date=?, end_date=? WHERE id=?",
                [title, description, status, start_date, end_date, id],
                function (err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                }
            );
        });
    },

    delete(id) {
        return new Promise((resolve, reject) => {
            //if a project has active task do not remove it
            db.get("SELECT COUNT(*) AS count FROM tasks WHERE project_id = ? AND status != 'completed'", [id], (err, row) => {
                if (err) return reject(err);
                if (row.count > 0) return reject(new Error("you cannot delete this project bevause there are active tasks in this project."));

                db.run("DELETE FROM tasks WHERE project_id = ?", [id], (err) => {
                    if (err) return reject(err);
                    db.run("DELETE FROM project_members WHERE project_id = ?", [id], (err) => {
                        if (err) return reject(err);
                        db.run("DELETE FROM projects WHERE id = ?", [id], function (err) {
                            if (err) reject(err);
                            else resolve({ changes: this.changes });
                        });
                    });
                });
            });
        });
    },

    search(query) {
        return new Promise((resolve, reject) => {
            db.all(
                "SELECT * FROM projects WHERE title LIKE ? OR description LIKE ?",
                [`%${query}%`, `%${query}%`],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }
};

module.exports = projectService;
