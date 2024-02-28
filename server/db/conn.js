// const { Pool } = require('pg');

// // Configurazione per la connessione al database PostgreSQL
// const config = {
//   user: 'postgres',        // Nome utente del database
//   password: 'admin',       // Password del database
//   host: 'localhost',       // Indirizzo del server del database
//   port: 5432,              // Porta del server del database
//   database: 'ahrw_membrapol', // Nome del database
// };

// // Creazione di un pool di connessioni PostgreSQL
// const pool = new Pool(config);

// // Export del modulo
// module.exports = {
//   // Funzione per eseguire le query
//   query: (text, params, callback) => {
//     return pool.query(text, params, callback);
//   },
//   // Funzione per connettersi al database
//   connectToServer: (callback) => {
//     pool.connect((err, client, release) => {
//       if (err) {
//         return console.error('Errore durante la connessione al database', err.stack);
//       }
//       console.log('Connessione al database avvenuta con successo');
//       callback(client, release);
//     });
//   },
// };




const sql = require('mssql');

// Configurazione per la connessione al database SQL Server
const config = {
  user: 'sa',       // Nome utente del database SQL Server
  password: 'admin',   // Password del database SQL Server
  server: '127.0.0.1',    // Indirizzo del server del database SQL Server
  port: 1433,             // Porta del server del database SQL Server (di solito 1433)
  database: 'calibatrice',// Nome del database SQL Server
  stream: false, 
  options: {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

// Creazione di un pool di connessioni SQL Server
const pool = new sql.ConnectionPool(config);

// Export del modulo
module.exports = {
  // Funzione per eseguire le query
  query: async (text, params) => {
    try {
      await pool.connect();
      const request = pool.request();
      const result = await request.query(text, params);
      return result.recordset;
    } catch (err) {
      console.error('Errore durante l\'esecuzione della query:', err);
      throw err;
    }
  },
  // Funzione per connettersi al database
  connectToServer: async (callback) => {
    try {
      await pool.connect();
      console.log('Connessione al database avvenuta con successo');
      callback(pool);
    } catch (err) {
      console.error('Errore durante la connessione al database:', err);
    }
  },
};