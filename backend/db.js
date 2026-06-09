const mysql = require('mysql2');
require('dotenv').config();

// La conexion usa variables de entorno para poder cambiar entre local y Alwaysdata.
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Intentamos conectar al iniciar el backend para detectar errores rapido.
db.connect((err) => {
  if (err) {
    console.error('Error de conexion a MySQL:', err);
    return;
  }

  console.log('Conectado a MySQL');
});

module.exports = db;
