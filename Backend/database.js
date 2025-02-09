const sqlite3 = require('sqlite3').verbose();

// Conexión a la base de datos (archivo local)
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Crea una tabla para almacenar cuentos generados
db.run(`
    CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic TEXT NOT NULL,
        story TEXT NOT NULL
    )
`);

module.exports = db;
