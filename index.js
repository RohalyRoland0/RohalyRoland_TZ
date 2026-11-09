const express = require("express");
const app = express();
const mysql = require("mysql2");
const port = 3000;
 
app.use(express.json());
 
app.listen(port, () => {
    console.log(`A szerver ${port}-as porton fut.`);
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
    const szoveg = req.params.szoveg;
    connection.query(
        'SELECT * FROM konyvek WHERE cim LIKE ?',
        [`%${szoveg}%`],
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

app.post('/api/konyvek', (req, res) => {
    const { mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto } = req.body;
    connection.query(
        `INSERT INTO konyvek (mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto) VALUES (?, ?, ?, ?, ?)`,
        [mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json({
                message: "Könyv sikeresen hozzáadva",
                id: result.insertId
            });
        }
    );
});

app.post('/api/mufajok', (req, res) => {
    const { id, nev } = req.body;
    connection.query(
        `INSERT INTO mufajok (id, nev) VALUES (?, ?)`,
        [id, nev],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json({
                message: "Műfaj sikeresen hozzáadva",
                id: result.insertId
            });
        }
    );
});

app.patch('/api/konyvek/cim/:id', (req, res) => {
    const { cim } = req.body;
    connection.query(
        'UPDATE konyvek SET cim = ? WHERE id = ?',
        [cim, req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json({
                message: "Cím módosítva"
            });
        }
    );
});

app.patch('/api/konyvek/kolcsonozheto/:id', (req, res) => {
    const { kolcsonozheto } = req.body;
    connection.query(
        'UPDATE konyvek SET kolcsonozheto = ? WHERE id = ?',
        [kolcsonozheto, req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json({
                message: "Kölcsönözés módosítva"
            });
        }
    );
});

app.delete('/api/konyvek/:id', (req, res) => {
    connection.query(
        'DELETE FROM konyvek WHERE id = ?',
        [req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json({
                message: "Könyv törölve",
            });
        }
    );
});

app.delete('/api/mufajok/:id', (req, res) => {
    connection.query(
        'DELETE FROM mufajok WHERE id = ?',
        [req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json({
                message: "Műfaj törölve",
            });
        }
    );
});