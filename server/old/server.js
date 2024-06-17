const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "*", // Specifica l'origine consentita, puoi anche specificare specifici domini invece di "*" per consentire solo da domini specifici
  methods: "GET, POST, PUT, DELETE", // Specifica i metodi HTTP consentiti
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");

app.get(
 '/', function (req, res){res.send('Benvenuto al server');}
);

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
   });
  console.log(`Server is running on port: ${port}`);
});