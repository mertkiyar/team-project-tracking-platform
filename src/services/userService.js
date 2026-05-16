const db = require("../config/database");
const bcrypt = require("bcryptjs");

const userService = {
    getAll() {
        return new Promise((resolve, reject) => {
            db.all("SELECT id, name, email, role, department FROM users", [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    getById(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT id, name, email, role, department FROM users WHERE id = ?", [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    create(data) {
        const { name, email, password, role = 'employee', department } = data;
        return new Promise((resolve, reject) => {
            if (!name || !email || !password) {
                return reject(new Error("Name, email and password are required"));
            }
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) return reject(err);

                db.run(
                    "INSERT INTO users (name, email, password, role, department) VALUES (?, ?, ?, ?, ?)",
                    [name, email, hashedPassword, role, department],
                    function (err) {
                        if (err) reject(err);
                        else resolve({ id: this.lastID, name, email, role, department });
                    }
                );
            });
        });
    },

    update(id, data) {
        const { name, email, role, department } = data;
        return new Promise((resolve, reject) => {
            db.run(
                "UPDATE users SET name = ?, email = ?, role = ?, department = ? WHERE id = ?",
                [name, email, role, department, id],
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
