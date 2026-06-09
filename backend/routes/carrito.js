const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../middleware/auth');

// GET carrito
router.get('/', verificarToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    `
    SELECT c.id_item, p.nombre, p.precio, c.cantidad
    FROM carrito c
    JOIN productos p
      ON c.id_producto = p.id
    WHERE c.id_usuario=?
    `,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// ADD
// Agrega un producto al carrito sin superar el stock disponible.
router.post('/', verificarToken, (req, res) => {
  const userId = req.user.id;
  const { id_producto } = req.body;

  db.query(
    `
    SELECT
      productos.stock,
      COALESCE(carrito.cantidad, 0) AS cantidad
    FROM productos
    LEFT JOIN carrito
      ON carrito.id_producto = productos.id
      AND carrito.id_usuario = ?
    WHERE productos.id = ?
    `,
    [userId, id_producto],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      const stock = Number(results[0].stock || 0);
      const cantidadActual = Number(results[0].cantidad || 0);

      if (stock <= cantidadActual) {
        return res.status(400).json({ message: 'No hay stock suficiente' });
      }

      if (cantidadActual > 0) {
        db.query(
          `
          UPDATE carrito
          SET cantidad = cantidad + 1
          WHERE id_usuario=? AND id_producto=?
          `,
          [userId, id_producto],
          (err2) => {
            if (err2) return res.status(500).json(err2);
            res.json({ message: 'Cantidad actualizada' });
          }
        );

        return;
      }

      db.query(
        `
        INSERT INTO carrito
        (id_usuario, id_producto, cantidad)
        VALUES (?, ?, 1)
        `,
        [userId, id_producto],
        (err3) => {
          if (err3) return res.status(500).json(err3);
          res.json({ message: 'Agregado' });
        }
      );
    }
  );
});

// Aumenta cantidad sin superar el stock.
router.put('/sumar/:id', verificarToken, (req, res) => {
  db.query(
    `
    SELECT carrito.cantidad, productos.stock
    FROM carrito
    JOIN productos
      ON productos.id = carrito.id_producto
    WHERE carrito.id_item=?
    `,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }

      const cantidad = Number(results[0].cantidad);
      const stock = Number(results[0].stock || 0);

      if (cantidad >= stock) {
        return res.status(400).json({ message: 'No hay stock suficiente' });
      }

      db.query(
        `
        UPDATE carrito
        SET cantidad = cantidad + 1
        WHERE id_item=?
        `,
        [req.params.id],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          res.json({ message: 'Cantidad aumentada' });
        }
      );
    }
  );
});

// Disminuye cantidad; si queda en cero elimina el item.
router.put('/restar/:id', verificarToken, (req, res) => {
  db.query(
    `
    SELECT cantidad
    FROM carrito
    WHERE id_item=?
    `,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }

      const cantidad = results[0].cantidad;

      if (cantidad <= 1) {
        db.query(
          `
          DELETE FROM carrito
          WHERE id_item=?
          `,
          [req.params.id],
          (err2) => {
            if (err2) return res.status(500).json(err2);
            res.json({ message: 'Producto eliminado' });
          }
        );

        return;
      }

      db.query(
        `
        UPDATE carrito
        SET cantidad = cantidad - 1
        WHERE id_item=?
        `,
        [req.params.id],
        (err3) => {
          if (err3) return res.status(500).json(err3);
          res.json({ message: 'Cantidad reducida' });
        }
      );
    }
  );
});

// Elimina un item del carrito.
router.delete('/:id', verificarToken, (req, res) => {
  db.query(
    `
    DELETE FROM carrito
    WHERE id_item=?
    `,
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Producto eliminado' });
    }
  );
});

module.exports = router;
