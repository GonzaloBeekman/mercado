const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const entregasRoutes = require('./routes/entregas');

// Origenes permitidos para que el frontend pueda consumir la API.
// En produccion CORS_ORIGIN debe ser la URL de Vercel, por ejemplo:
// https://mi-market-app.vercel.app
const allowedOrigins = [
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:8083',
  'http://localhost:19006',
  process.env.CORS_ORIGIN
].filter(Boolean);

// CORS bloquea paginas desconocidas, pero permite local y la web publicada.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origen no permitido por CORS'));
    }
  })
);

// Permitimos JSON mas grande porque la foto de perfil se guarda como base64.
app.use(express.json({ limit: '5mb' }));

// Rutas principales de la API.
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/carrito', require('./routes/carrito'));
app.use('/api/entregas', entregasRoutes);

// Ruta simple para comprobar que el servidor esta prendido.
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// En local usa 3000; en hosting usa el puerto que entregue la plataforma.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
