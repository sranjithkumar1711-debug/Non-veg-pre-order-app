require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Pre-order save panna API
app.post('/api/preorder', (req, res) => {
  const { name, phone, category, variety, quantity, slot } = req.body;
  const sql = `INSERT INTO preorders (name, phone, category, variety, quantity, slot) VALUES (?,?,?,?,?,?)`;
  db.query(sql, [name, phone, category, variety, quantity, slot], (err, result) => {
    if(err) return res.status(500).json({error: err.message});
    res.json({ success: true, orderId: 'ORD' + result.insertId });
  });
});

// Ella pre-orders paaka (shop owner ku)
app.get('/api/preorders', (req, res) => {
  db.query('SELECT * FROM preorders ORDER BY created_at DESC', (err, rows) => {
    if(err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on ' + PORT));
