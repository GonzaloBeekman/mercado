const express = require('express');
const router = express.Router();

const db = require('../db');
const verificarToken = require('../middleware/auth');

// Genera un codigo corto a partir del pedido y comprador.
// No se guarda en la base de datos para no tener que modificar tablas.
const generarCodigoEntrega = (idEntrega, idComprador) => {
  const numero = (Number(idEntrega) * 97 + Number(idComprador) * 13) % 1000;

  return String(numero).padStart(3, '0');
};

// CREAR ENTREGA
// Crea una entrega para un producto comprado por el usuario logueado.
router.post('/', verificarToken, (req, res) => {
  const { id_producto } = req.body;
  const id_comprador = req.user.id;

  db.query(
    `
    INSERT INTO entregas
    (id_producto, id_comprador)
    VALUES (?, ?)
    `,
    [id_producto, id_comprador],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({
        message: 'Entrega creada'
      });
    }
  );
});

// VER ENTREGAS
// Comprador: ve solo sus pedidos.
// Vendedor y repartidor: ven todos los pedidos para controlar estados.
router.get('/', verificarToken, (req, res) => {
  const userId = req.user.id;
  const rol = req.user.rol;

  const filtroComprador =
    rol === 'comprador'
      ? 'WHERE entregas.id_comprador = ?'
      : '';

  const params =
    rol === 'comprador'
      ? [userId]
      : [];

  db.query(
    `
    SELECT
      entregas.id,
      entregas.id_comprador,
      entregas.estado,
      entregas.fecha,
      productos.nombre AS producto,
      usuarios.nombre AS comprador
    FROM entregas
    JOIN productos
      ON productos.id = entregas.id_producto
    JOIN usuarios
      ON usuarios.id = entregas.id_comprador
    ${filtroComprador}
    ORDER BY entregas.id DESC
    `,
    params,
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      const entregasConCodigo = results.map((entrega) => {
        const codigoEntrega =
          rol === 'comprador'
            ? generarCodigoEntrega(entrega.id, entrega.id_comprador)
            : null;

        return {
          id: entrega.id,
          estado: entrega.estado,
          fecha: entrega.fecha,
          producto: entrega.producto,
          comprador: entrega.comprador,
          codigo_entrega: codigoEntrega
        };
      });

      res.json(entregasConCodigo);
    }
  );
});

// COMPLETAR ENTREGA
// Cambia el estado a completado cuando el repartidor ingresa el codigo correcto.
router.put('/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { codigo_entrega } = req.body;

  if (req.user.rol !== 'repartidor') {
    return res.status(403).json({
      message: 'Solo el repartidor puede completar entregas'
    });
  }

  if (!codigo_entrega) {
    return res.status(400).json({
      message: 'Codigo de entrega requerido'
    });
  }

  db.query(
    `
    SELECT id, id_comprador
    FROM entregas
    WHERE id=?
    `,
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: 'Entrega no encontrada'
        });
      }

      const entrega = results[0];
      const codigoCorrecto = generarCodigoEntrega(
        entrega.id,
        entrega.id_comprador
      );

      if (String(codigo_entrega) !== codigoCorrecto) {
        return res.status(403).json({
          message: 'Codigo de entrega incorrecto'
        });
      }

      db.query(
        `
        UPDATE entregas
        SET estado='completado'
        WHERE id=?
        `,
        [id],
        (err2) => {
          if (err2) {
            console.log(err2);
            return res.status(500).json(err2);
          }

          res.json({
            message: 'Entrega completada'
          });
        }
      );
    }
  );
});

// FINALIZAR COMPRA
// Toma los productos del carrito, crea entregas pendientes, descuenta stock y vacia el carrito.
router.post('/finalizar', verificarToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    `
    SELECT *
    FROM carrito
    WHERE id_usuario=?
    `,
    [userId],
    (err, items) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      if (items.length === 0) {
        return res.status(400).json({
          message: 'Carrito vacio'
        });
      }

      items.forEach((item) => {
        db.query(
          `
          INSERT INTO entregas
          (id_producto, id_comprador)
          VALUES (?, ?)
          `,
          [
            item.id_producto,
            userId
          ]
        );

        db.query(
          `
          UPDATE productos
          SET stock = stock - ?
          WHERE id=?
          `,
          [
            item.cantidad,
            item.id_producto
          ]
        );
      });

      db.query(
        `
        DELETE FROM carrito
        WHERE id_usuario=?
        `,
        [userId]
      );

      res.json({
        message: 'Compra finalizada'
      });
    }
  );
});

module.exports = router;
