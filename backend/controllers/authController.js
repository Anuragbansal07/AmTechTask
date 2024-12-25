const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../models/db");
const axios = require("axios");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "Registration successful!" });
  } catch (err) {
    res.status(400).json({ error: "User already exists!" });
  }
};

const loginUser = async (req, res) => {
  const { username, password, recaptcha } = req.body;

  try {
    const secretKey = `${process.env.RECAPTCHA_SECRET_KEY}`;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=6LcMYaUqAAAAAKkNtIV2vbmPM-2jxefkYe51DqCw&response=${recaptcha}`;

    const response = await axios.post(verifyUrl);
    const isHuman = response.data.success;

    if (!isHuman) {
      return res.status(400).json({ error: "reCAPTCHA verification failed." });
    }

    const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found!" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password!" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, username: user.rows[0].username },
      `${process.env.JWT_SECRET}`,
      { expiresIn: "15m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Strict" });
    res.json({ message: "Login successful!" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await pool.query("SELECT id, username, email, created_at FROM users WHERE id = $1", [userId]);

    res.status(200).json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

module.exports = { registerUser, loginUser, getProfile };
