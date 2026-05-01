const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { name, description, price } = req.body;
  const image = req.file ? req.file.filename : null;
  try {
    await db.query(
      'INSERT INTO products (name, description, price, image, user_id) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, image, req.user.id]
    );
    res.status(201).json({ message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  const { name, description, price } = req.body;
  const image = req.file ? req.file.filename : null;
  try {
    const fields = image
      ? 'name = ?, description = ?, price = ?, image = ?'
      : 'name = ?, description = ?, price = ?';
    const values = image
      ? [name, description, price, image, req.params.id, req.user.id]
      : [name, description, price, req.params.id, req.user.id];

    await db.query(
      `UPDATE products SET ${fields} WHERE id = ? AND user_id = ?`,
      values
    );
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};