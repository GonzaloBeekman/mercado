const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verificarToken = require('../middleware/auth');

// Clave para firmar tokens. En produccion conviene cargar JWT_SECRET en .env.
const SECRET = process.env.JWT_SECRET || 'secreto';

// REGISTER
router.post('/register', async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, rol || 'cliente'],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Usuario creado' });
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM usuarios WHERE email=?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.status(401).json({ message: 'Usuario no existe' });
      }

      const user = results[0];
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(401).json({ message: 'Contrasena incorrecta' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token });
    }
  );
});

// PERFIL
router.get('/perfil', verificarToken, (req, res) => {
  const id = req.user.id;

  db.query(
    'SELECT id, nombre, email, foto FROM usuarios WHERE id=?',
    [id],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json(results[0]);
    }
  );
});

// UPDATE PERFIL
router.put('/perfil', verificarToken, async (req, res) => {
  const id = req.user.id;
  const { nombre, password, foto } = req.body;

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ message: 'El nombre es obligatorio' });
  }

  try {
    if (password) {
      const hash = await bcrypt.hash(password, 10);

      db.query(
        'UPDATE usuarios SET nombre=?, password=?, foto=? WHERE id=?',
        [nombre.trim(), hash, foto || null, id],
        (err) => {
          if (err) {
            return res.status(500).json({
              message: 'Error al guardar perfil en la base de datos',
              detail: err.message
            });
          }

          res.json({ message: 'Actualizado' });
        }
      );

      return;
    }

    db.query(
      'UPDATE usuarios SET nombre=?, foto=? WHERE id=?',
      [nombre.trim(), foto || null, id],
      (err) => {
        if (err) {
          return res.status(500).json({
            message: 'Error al guardar perfil en la base de datos',
            detail: err.message
          });
        }

        res.json({ message: 'Actualizado' });
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
});

// LOGIN GOOGLE
router.post('/google', async (req, res) => {
  const { nombre, email } = req.body;

  try {
    db.query(
      'SELECT * FROM usuarios WHERE email=?',
      [email],
      (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length > 0) {
          const usuario = results[0];

          const token = jwt.sign(
            {
              id: usuario.id,
              email: usuario.email,
              rol: usuario.rol
            },
            SECRET
          );

          return res.json({ token });
        }

        db.query(
          'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
          [nombre, email, 'google-login', 'comprador'],
          (err2, result) => {
            if (err2) return res.status(500).json(err2);

            const token = jwt.sign(
              {
                id: result.insertId,
                nombre,
                email,
                rol: 'comprador'
              },
              SECRET
            );

            res.json({ token });
          }
        );
      }
    );
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Error Google login'
    });
  }
});

module.exports = router;
