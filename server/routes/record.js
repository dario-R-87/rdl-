const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const db = require("../db/conn");

recordRoutes.route("/articoli/:azienda").get(function (req, res) {
  const azienda = req.params.azienda;
  db.query(`SELECT CACODICE, CADESART, CADESSUP, CACODART FROM dbo.${azienda}KEY_ARTI`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});
//SELECT ARGESMAT FROM dbo.HRI__ART_ICOL

recordRoutes.route("/artsdata/:azienda/:serial").get(function (req, res) {
  const serial = req.params.serial;
  const azienda = req.params.azienda;
  db.query(`SELECT ARGESMAT, ARUNMIS1, ARUNMIS2, ARDESART FROM dbo.${azienda}ART_ICOL WHERE ARCODART='${serial}'`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

recordRoutes.route("/matricole/:azienda/:serial").get(function (req, res) {
  const serial = req.params.serial;
  const azienda = req.params.azienda;
  db.query(`SELECT * FROM dbo.${azienda}MATRICOL WHERE AMKEYSAL='${serial}'`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

recordRoutes.route("/documenti/:azienda").get(function (req, res) {
  const azienda = req.params.azienda;
  db.query(`SELECT SERIAL, TIPDOC, DATDOC, COUNT(*) FROM dbo.${azienda}ZUAPPAHR WHERE (FLIMPO IS NULL) GROUP BY SERIAL, TIPDOC, DATDOC`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

recordRoutes.route("/documento/:azienda/:serial").get(function (req, res) {
  const azienda = req.params.azienda;
  const serial = req.params.serial;

  db.query(`SELECT * FROM dbo.${azienda}ZUAPPAHR WHERE SERIAL='${serial}'`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

recordRoutes.route("/new_serial/:azienda").get(function (req, res) {
  const azienda = req.params.azienda;
  db.query(`SELECT MAX(SERIAL) AS MAX_SERIAL FROM dbo.${azienda}ZUAPPAHR`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

recordRoutes.route("/record/delete/:azienda/:serial").delete(function (req, res) {
  const azienda = req.params.azienda;
  const serial = req.params.serial;
  db.query(`DELETE FROM dbo.${azienda}ZUAPPAHR WHERE SERIAL='${serial}'`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

// This section will help you create a new record.
recordRoutes.route("/record/add/:azienda").post(function (req, res) {
  const azienda = req.params.azienda;
  const {
    serial,
    tipdoc,
    datadoc,
    codcon,
    tipcon,
    codart,
    unimis,
    quanti,
    codmat,
    magpar,
    magdes,
    insuser,
    rownum
  } = req.body; // Assumendo che il body della richiesta contenga i dati per il nuovo record

  db.query(`INSERT INTO dbo.${azienda}ZUAPPAHR (SERIAL, TIPDOC, DATDOC, ZUCODCON, ZUTIPCON, CODART, UNIMIS, QUANTI, CODMAT, MAGPAR, MAGDES, INSUSER, ROWNUM) VALUES
  ('${serial}', '${tipdoc}', '${datadoc}', '${codcon}', '${tipcon}','${codart}', '${unimis}', ${quanti}, '${codmat}', '${magpar}', '${magdes}', '${insuser}', ${rownum})`)
    .then(result => {
      res.status(201).json({ message: "Record aggiunto con successo" });
    })
    .catch(err => {
      console.error("Errore nell'aggiunta del record:", err);
      res.status(500).json({ error: "Errore nell'aggiunta del record" });
    });
});

recordRoutes.route("/doctype/:azienda").get(function (req, res) {
  const azienda = req.params.azienda;
  db.query(`SELECT TDTIPDOC,TDDESDOC,ZUFLGAPP,TDCAUMAG,TDFLINTE FROM dbo.${azienda}TIP_DOCU WHERE ZUFLGAPP='S'`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

recordRoutes.route("/mag/:azienda").get(function (req, res) {
  const azienda = req.params.azienda;
  db.query(`SELECT MGCODMAG, MGDESMAG FROM dbo.${azienda}MAGAZZIN`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

recordRoutes.route("/causale_mag/:azienda/:causale_mag").get(function (req, res) {
  const azienda = req.params.azienda;
  const causale_mag = req.params.causale_mag;
  db.query(`SELECT CMCAUCOL FROM dbo.${azienda}CAM_AGAZ WHERE CMCODICE='${causale_mag}'`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

recordRoutes.route("/users").get(function (req, res) {
  db.query("SELECT CODE, NAME, PASSWD FROM dbo.CPUSERS WHERE webtype='S'")
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

recordRoutes.route("/aziende").get(function (req, res) {
  db.query("SELECT AZCODAZI, AZRAGAZI FROM dbo.AZIENDA")
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

recordRoutes.route("/clienti/:azienda").get(function (req, res) {
  const azienda = req.params.azienda;
  db.query(`SELECT ANTIPCON, ANCODICE, ANDESCRI,ANDESCR2, ANDTOBSO FROM dbo.${azienda}CONTI
  WHERE ANTIPCON='C' AND (ANDTOBSO IS NULL OR ANDTOBSO > GETDATE())`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

recordRoutes.route("/clienti/:azienda/:serial").get(function (req, res) {
  const azienda = req.params.azienda;
  const serial = req.params.serial;
  db.query(`SELECT ANDESCRI FROM dbo.${azienda}CONTI WHERE 
  ANTIPCON='C' AND ANCODICE='${serial}'`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

recordRoutes.route("/fornitori/:azienda").get(function (req, res) {
  const azienda = req.params.azienda;
  db.query(`SELECT ANTIPCON, ANCODICE, ANDESCRI,ANDESCR2, ANDTOBSO FROM dbo.${azienda}CONTI
  WHERE ANTIPCON='F' AND (ANDTOBSO IS NULL OR ANDTOBSO > GETDATE())`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

recordRoutes.route("/fornitori/:azienda/:serial").get(function (req, res) {
  const azienda = req.params.azienda;
  const serial = req.params.serial;
  db.query(`SELECT ANDESCRI FROM dbo.${azienda}CONTI WHERE 
  ANTIPCON='F' AND ANCODICE='${serial}'`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

module.exports = recordRoutes;
