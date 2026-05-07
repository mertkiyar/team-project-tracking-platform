const db = require("../config/database");

const userService = {
    getAll() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM users", [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    getById(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    create(data) {
        const { name, email, department } = data;
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO users (name, email, department) VALUES (?, ?, ?)",
                [name, email, department],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, name, email, department });
                }
            );
        });
    },

    update(id, data) {
        const { name, email, department } = data;
        return new Promise((resolve, reject) => {
            db.run(
                "UPDATE users SET name = ?, email = ?, department = ? WHERE id = ?",
                [name, email, department, id],
                function (err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                }
            );
        });
    },

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },
};

module.exports = userService;
