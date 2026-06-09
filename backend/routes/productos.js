const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');


// =========================
// GET TODOS LOS PRODUCTOS
// =========================
router.get('/', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// =========================
// GET PRODUCTO POR ID
// =========================
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.query(
    'SELECT * FROM productos WHERE id = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results[0]);
    }
  );
});


// =========================
// CREAR PRODUCTO (ADMIN)
// =========================
router.post('/', verificarToken, verificarAdmin, (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url } = req.body;

  db.query(
    'INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url) VALUES (?, ?, ?, ?, ?)',
    [nombre, descripcion, precio, stock, imagen_url],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Producto creado correctamente' });
    }
  );
});


// =========================
// EDITAR PRODUCTO
// =========================
router.put('/:id', verificarToken, (req, res) => {
  const { id } = req.params;

  const {
    nombre,
    precio,
    stock,
    descripcion,
    imagen_url
  } = req.body;

  db.query(
    'UPDATE productos SET nombre=?, precio=?, stock=?, descripcion=?, imagen_url=? WHERE id=?',
    [nombre, precio, stock, descripcion, imagen_url, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Producto actualizado correctamente' });
    }
  );
});


// =========================
// ELIMINAR PRODUCTO (ADMIN)
// =========================
router.delete('/:id', verificarToken, verificarAdmin, (req, res) => {
  const { id } = req.params;

  db.query(
    'DELETE FROM productos WHERE id=?',
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Producto eliminado correctamente' });
    }
  );
});


module.exports = router;