const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "very-secret-key-1234";

const authService = {
    login(email, password) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
                if (err) return reject(err);
                if (!user) return reject(new Error("user not found"));


                const isMatch = await bcrypt.compare(password, user.password).catch(() => password === user.password);

                if (!isMatch) return reject(new Error("wrong password"));

                //create token
                const token = jwt.sign(
                    { id: user.id, role: user.role, name: user.name },
                    SECRET_KEY,
                    { expiresIn: "1h" }
                );

                resolve({ token, user: { id: user.id, name: user.name, role: user.role } });
            });
        });
    }
};

module.exports = authService;
