const express = require("express");
const app = express();
const mysql = require("mysql2");
const port = 3000;
 
app.use(express.json());
 
app.listen(port, () => {
    console.log(`A szerver fut.`);
})
 
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "konyvtar_db",
    port: 3307
});
 
connection.connect((err) => {
    if (err) {
      console.error("Hiba", err);
      return;
    }
    console.log("Siker");
  });
 
app.get('/api/konyvek', (req, res) => {
    connection.query(
        'SELECT * FROM konyvek ORDER BY kiadasi_ev ASC',
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(results);
        }
    );
});
app.get('/api/konyvek/elerheto', (req, res) => {
    connection.query(
        'SELECT * FROM konyvek WHERE kolcsonozheto LIKE "1" AND kiadasi_ev <= 2000',
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(results);
        }
    );
});
app.get('/api/konyvek/kereses/:szoveg', (req, res) => {
    connection.query(
        'SELECT * FROM konyvek WHERE cim LIKE ""',
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(results);
        }
    );
});

app.get('/api/konyvek/hosszuak', (req, res) => {
    connection.query(
        'SELECT cim, kiadasi_ev, oldalszam FROM konyvek WHERE oldalszam > 400 ORDER BY oldalszam DESC',
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(results);
        }
    );
});