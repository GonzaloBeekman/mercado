const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../middleware/auth');

// GET carrito
router.get('/', verificarToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT c.id_item, p.nombre, p.precio, c.cantidad
     FROM carrito c
     JOIN productos p ON c.id_producto = p.id
     WHERE c.id_usuario=?`,
    [userId],
    (err, results) => {
      res.json(results);
    }
  );
});

// ADD
router.post('/', verificarToken, (req, res) => {

  const userId = req.user.id;
  const { id_producto } = req.body;

  // verificar si existe
  db.query(
    `
    SELECT * FROM carrito
    WHERE id_usuario=? AND id_producto=?
    `,
    [userId, id_producto],

    (err, results) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      // ya existe
      if (results.length > 0) {

        db.query(
          `
          UPDATE carrito
          SET cantidad = cantidad + 1
          WHERE id_usuario=? AND id_producto=?
          `,
          [userId, id_producto],

          (err2) => {

            if (err2) {
              console.log(err2);
              return res.status(500).json(err2);
            }

            res.json({
              message: 'Cantidad actualizada'
            });
          }
        );

      } else {

        // nuevo item
        db.query(
          `
          INSERT INTO carrito
          (id_usuario, id_producto, cantidad)
          VALUES (?, ?, 1)
          `,
          [userId, id_producto],

          (err3) => {

            if (err3) {
              console.log(err3);
              return res.status(500).json(err3);
            }

            res.json({
              message: 'Agregado'
            });
          }
        );
      }
    }
  );
});
// ➕ aumentar cantidad
router.put('/sumar/:id', verificarToken, (req, res) => {

  db.query(
    `
    UPDATE carrito
    SET cantidad = cantidad + 1
    WHERE id_item=?
    `,
    [req.params.id],

    (err) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({
        message: 'Cantidad aumentada'
      });
    }
  );
});
// ➖ disminuir cantidad
router.put('/restar/:id', verificarToken, (req, res) => {

  // buscar item
  db.query(
    `
    SELECT cantidad
    FROM carrito
    WHERE id_item=?
    `,
    [req.params.id],

    (err, results) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      // no existe
      if (results.length === 0) {
        return res.status(404).json({
          message: 'Item no encontrado'
        });
      }

      const cantidad =
        results[0].cantidad;

      // si queda 0 → eliminar
      if (cantidad <= 1) {

        db.query(
          `
          DELETE FROM carrito
          WHERE id_item=?
          `,
          [req.params.id],

          (err2) => {

            if (err2) {
              console.log(err2);
              return res.status(500).json(err2);
            }

            res.json({
              message: 'Producto eliminado'
            });
          }
        );

      } else {

        // restar
        db.query(
          `
          UPDATE carrito
          SET cantidad = cantidad - 1
          WHERE id_item=?
          `,
          [req.params.id],

          (err3) => {

            if (err3) {
              console.log(err3);
              return res.status(500).json(err3);
            }

            res.json({
              message: 'Cantidad reducida'
            });
          }
        );
      }
    }
  );
});
// ❌ eliminar item
router.delete('/:id', verificarToken, (req, res) => {

  db.query(
    `
    DELETE FROM carrito
    WHERE id_item=?
    `,
    [req.params.id],

    (err) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({
        message: 'Producto eliminado'
      });
    }
  );
});
module.exports = router;