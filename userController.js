// controllers/userController.js
const db = require('../config/db'); // ✅ db import at top

// ─────────────────────────────────────────
//  CREATE  –  POST /api/users
// ─────────────────────────────────────────
const createUser = (req, res) => {
  const { username, name, email, password, age } = req.body;

  if (!username || !name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'username, name, email and password are required.',
    });
  }

  const sql = 'INSERT INTO users (username, name, email, password, age) VALUES (?, ?, ?, ?, ?)';
  const values = [username, name, email, password, age || null];

  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Email or username already exists.' });
      }
      return res.status(500).json({ success: false, message: 'Database error.', error: err.message });
    }
    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      userId: result.insertId,
    });
  });
};

// ─────────────────────────────────────────
//  READ ALL  –  GET /api/users
// ─────────────────────────────────────────
const getAllUsers = (req, res) => {
  const sql = 'SELECT id, username, name, email, age, image, profile_image FROM users';

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error.', error: err.message });
    }
    return res.status(200).json({ success: true, count: results.length, data: results });
  });
};

// ─────────────────────────────────────────
//  READ ONE  –  GET /api/users/:id
// ─────────────────────────────────────────
const getUserById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT id, username, name, email, age, image, profile_image FROM users WHERE id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error.', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: `User with id ${id} not found.` });
    }
    return res.status(200).json({ success: true, data: results[0] });
  });
};

// ─────────────────────────────────────────
//  UPDATE  –  PUT /api/users/:id
// ─────────────────────────────────────────
const updateUser = (req, res) => {
  const { id } = req.params;
  const { username, name, email, password, age } = req.body;

  const fields = [];
  const values = [];

  if (username) { fields.push('username = ?'); values.push(username); }
  if (name)     { fields.push('name = ?');     values.push(name); }
  if (email)    { fields.push('email = ?');    values.push(email); }
  if (password) { fields.push('password = ?'); values.push(password); }
  if (age)      { fields.push('age = ?');      values.push(age); }

  if (fields.length === 0) {
    return res.status(400).json({ success: false, message: 'No fields provided to update.' });
  }

  values.push(id);
  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Email or username already in use.' });
      }
      return res.status(500).json({ success: false, message: 'Database error.', error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: `User with id ${id} not found.` });
    }
    return res.status(200).json({ success: true, message: 'User updated successfully.' });
  });
};

// ─────────────────────────────────────────
//  DELETE  –  DELETE /api/users/:id
// ─────────────────────────────────────────
const deleteUser = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error.', error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: `User with id ${id} not found.` });
    }
    return res.status(200).json({ success: true, message: 'User deleted successfully.' });
  });
};

// ✅ MUST export all 5 functions
module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };