const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verificarToken = require('../middleware/auth');

const SECRET = 'secreto';

// REGISTER
router.post('/register', async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
    [nombre, email, hash, rol || 'cliente'],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Usuario creado' });
    }
  );
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM usuarios WHERE email=?',
    [email],
    async (err, results) => {
      if (results.length === 0) {
        return res.status(401).json({ message: 'Usuario no existe' });
      }

      const user = results[0];
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
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
      res.json(results[0]);
    }
  );
});

// UPDATE PERFIL
router.put('/perfil', verificarToken, async (req, res) => {
  const id = req.user.id;
  const { nombre, password,foto } = req.body;

  if (password) {
    const hash = await bcrypt.hash(password, 10);

    db.query(
      'UPDATE usuarios SET nombre=?, password=?, foto=? WHERE id=?',
      [nombre, hash, foto, id],
      () => res.json({ message: 'Actualizado' })
    );
  } else {
    db.query(
      'UPDATE usuarios SET nombre=?, foto=? WHERE id=?',
      [nombre, foto, id],
      () => res.json({ message: 'Actualizado' })
    );
  }
});

// LOGIN GOOGLE
router.post('/google', async (req, res) => {

  const { nombre, email } = req.body;

  try {

    // buscar usuario
    db.query(
      `
      SELECT * FROM usuarios
      WHERE email=?
      `,
      [email],

      async (err, results) => {

        if (err) {
          return res
            .status(500)
            .json(err);
        }

        let usuario;

        // existe
        if (results.length > 0) {

          usuario = results[0];

        } else {

          // crear usuario
          db.query(
            `
            INSERT INTO usuarios
            (nombre, email, password, rol)
            VALUES (?, ?, ?, ?)
            `,
            [
              nombre,
              email,
              'google-login',
              'comprador'
            ],

            (err2, result) => {

              if (err2) {
                return res
                  .status(500)
                  .json(err2);
              }

              const nuevoUsuario = {
                id: result.insertId,
                nombre,
                email,
                rol: 'comprador'
              };

              const token =
                jwt.sign(
                  nuevoUsuario,
                  SECRET
                );

              return res.json({
                token
              });
            }
          );

          return;
        }

        // token usuario existente
        const token =
          jwt.sign(
            {
              id: usuario.id,
              email: usuario.email,
              rol: usuario.rol
            },
            SECRET
          );

        res.json({ token });
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