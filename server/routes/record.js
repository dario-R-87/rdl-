const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const db = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
//const ObjectId = require("mongodb").ObjectId;

// recordRoutes.route("/record").get(function (req, res) {
//   db.query("SELECT * FROM dbo.Lotti")
//   .then(result => {
//     // if (result.rows.length > 0) { // Verifica se la risposta contiene dati
//     //   console.log("dati trovato"); // Restituisce i risultati come JSON
//     // } else {
//     //   console.log("Nessun dato trovato");
//     // }
//     res.json(result);
//   })
//     .catch(err => {
//       console.error("Errore nel recupero dei dati:", err);
//       res.status(500).json({ error: "Errore nel recupero dei dati" });
//     });
// });

recordRoutes.route("/articoli").get(function (req, res) {
  db.query("SELECT CACODICE, CADESART, CADESSUP FROM dbo.HRI__KEY_ARTI")
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

recordRoutes.route("/record").get(function (req, res) {
  db.query("SELECT * FROM dbo.HRI__ZUAPPAHR")
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

recordRoutes.route("/new_serial").get(function (req, res) {
  db.query("SELECT MAX(SERIAL) AS MAX_SERIAL FROM dbo.HRI__ZUAPPAHR")
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Errore nel recupero dei dati:", err);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
    });
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, res) {
  const {
    serial,
    tipdoc,
    datadoc,
    codart,
    unimis,
    quanti,
    codmat,
    magpar,
    insuser,
    rownum
  } = req.body; // Assumendo che il body della richiesta contenga i dati per il nuovo record

  db.query(`INSERT INTO dbo.HRI__ZUAPPAHR (SERIAL, TIPDOC, DATDOC, CODART, UNIMIS, QUANTI, CODMAT, MAGPAR, INSUSER, ROWNUM) VALUES
  ('${serial}', '${tipdoc}', '${datadoc}', '${codart}', '${unimis}', ${quanti}, '${codmat}', '${magpar}', '${insuser}', ${rownum})`)
    .then(result => {
      res.status(201).json({ message: "Record aggiunto con successo" });
    })
    .catch(err => {
      console.error("Errore nell'aggiunta del record:", err);
      res.status(500).json({ error: "Errore nell'aggiunta del record" });
    });
  });

  //  let db_connect = dbo.getDb();
  //  let myobj = {
  //    name: req.body.name,
  //    surname: req.body.surname,
  // };
  //  /*db_connect.collection("persona").insertOne(myobj, function (err, res) {
  //    if (err) throw err;
  //    response.json(res);
  //  });*/
  //  db_connect.collection("persona").insertOne(myobj).then(res => {response.json(res);}).catch(err => {console.error("Errore nel recupero dei dati:", err);});


// // This section will help you get a list of all the records.
// recordRoutes.route("/record").get(function (req, res) {

//  let db_connect = dbo.getDb("prova");

// db_connect.collection("persona").find({}).toArray()
//   .then(result => {
//     res.json(result);
//   })
//   .catch(err => {
//     console.error("Errore nel recupero dei dati:", err);
//   });
// }); 

// // This section will help you get a single record by id
// recordRoutes.route("/record/:id").get(function (req, res) {
//  let db_connect = dbo.getDb();
// //req.params.id
//  let myquery = { _id: new ObjectId(req.params.id) };
//  /*db_connect.collection("persona").findOne(myquery, function (err, result) {
//      if (err) throw err;
//      res.json(result);
//     if (err) {
//       res.status(500).json({ error: "Errore nel recupero dei dati" });
//     } else {
//       res.json(result);
//     }
//    });*/
//   db_connect.collection("persona").findOne(myquery).then(result => {res.json(result);}).catch(err => {console.error("Errore nel recupero dei dati:", err);});
// });

// // This section will help you update a record by id.
// recordRoutes.route("/update/:id").post(function (req, response) {
//  let db_connect = dbo.getDb();
//  let myquery = { _id: new ObjectId(req.params.id) };
//  let newvalues = {
//    $set: {
//    name: req.body.name,
//    surname: req.body.surname,
//    },
//  };
//  /*db_connect.collection("persona").updateOne(myquery, newvalues, function (err, res) {
//      if (err) throw err;
//      console.log("1 document updated");
//      response.json(res);
//    });*/
//  db_connect.collection("persona").updateOne(myquery, newvalues).then(result => {response.json(result);}).catch(err => {console.error("Errore nel recupero dei dati:", err);});
// });

// // This section will help you delete a record
// recordRoutes.route("/:id").delete((req, response) => {

//  let db_connect = dbo.getDb();
//  console.log(req.params.id);
//  let obcId = new ObjectId(req.params.id);
//  let myquery = { _id: obcId };

//  /*db_connect.collection("persona").deleteOne(myquery, function (err, obj) {
//    if (err) throw err;
//    console.log("1 document deleted");
//    response.json(obj);
//  });*/
//  db_connect.collection("persona").deleteOne(myquery).then(result => {response.json(result);}).catch(err => {console.error("Errore cancellazione: ", err);});
// });

module.exports = recordRoutes;
