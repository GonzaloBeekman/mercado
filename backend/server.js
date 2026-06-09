const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const entregasRoutes = require('./routes/entregas');

// Origenes permitidos para que el frontend pueda consumir la API.
// CORS_ORIGIN puede tener una o varias URLs separadas por coma.
const allowedOrigins = [
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:8083',
  'http://localhost:19006',
  ...(process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
].filter(Boolean);

// Vercel genera URLs propias para preview y produccion, por eso permitimos *.vercel.app.
const isVercelOrigin = (origin) =>
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);

// CORS bloquea paginas desconocidas, pero permite local, Vercel y la URL configurada.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || isVercelOrigin(origin)) {
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
