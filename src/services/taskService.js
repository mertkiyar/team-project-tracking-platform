const db = require("../config/database");

const taskService = {
    getAll() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT tasks.*, users.name as assigned_name, projects.title as project_title
              FROM tasks 
              LEFT JOIN users ON tasks.assigned_to = users.id
              LEFT JOIN projects ON tasks.project_id = projects.id`, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    getById(id) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT tasks.*, users.name as assigned_name, projects.title as project_title
                 FROM tasks 
                 LEFT JOIN users ON tasks.assigned_to = users.id
                 LEFT JOIN projects ON tasks.project_id = projects.id
                 WHERE tasks.id = ?`,
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
                `SELECT tasks.*, users.name as assigned_name, projects.title as project_title
         FROM tasks 
         LEFT JOIN users ON tasks.assigned_to = users.id
         LEFT JOIN projects ON tasks.project_id = projects.id
         WHERE tasks.project_id = ?`,
                [projectId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    create(data) {
        const { project_id, assigned_to, title, description, tag, priority, status, deadline } = data;
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO tasks (project_id, assigned_to, title, description, tag, priority, status, deadline)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [project_id, assigned_to, title, description, tag || 'feature', priority || "medium", status || "todo", deadline],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...data });
                }
            );
        });
    },

    update(id, data) {
        const { project_id, assigned_to, title, description, tag, priority, status, deadline } = data;
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE tasks SET project_id=?, assigned_to=?, title=?, description=?, tag=?, priority=?, status=?, deadline=? WHERE id=?`,
                [project_id, assigned_to, title, description, tag, priority, status, deadline, id],
                function (err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                }
            );
        });
    },

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    filter(filters) {
        let query = `SELECT tasks.*, users.name as assigned_name, projects.title as project_title 
                     FROM tasks 
                     LEFT JOIN users ON tasks.assigned_to = users.id 
                     LEFT JOIN projects ON tasks.project_id = projects.id 
                     WHERE 1=1`;
        const params = [];
        if (filters.status) { query += " AND tasks.status = ?"; params.push(filters.status); }
        if (filters.priority) { query += " AND tasks.priority = ?"; params.push(filters.priority); }
        if (filters.tag) { query += " AND tasks.tag = ?"; params.push(filters.tag); }
        if (filters.project_id) { query += " AND tasks.project_id = ?"; params.push(filters.project_id); }
        return new Promise((resolve, reject) => {
            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

module.exports = taskService;
