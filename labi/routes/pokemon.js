const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data.db');

router.get('/', (req, res) => {
    db.all('SELECT * FROM pokemon', [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }

        res.render('pokemon/index', {
            pokemon: rows
        });
    });
});
router.get('/create', (req, res) => {
    res.render('pokemon/create');
});

router.post('/create', (req, res) => {

    db.run(
        'INSERT INTO pokemon (name, type, level) VALUES (?, ?, ?)',
        [
            req.body.name,
            req.body.type,
            req.body.level
        ],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send(err.message);
            }

            res.redirect('/pokemon');
        }
    );
});

router.get('/:id/edit', (req, res) => {

    db.get(
        'SELECT * FROM pokemon WHERE id = ?',
        [req.params.id],
        (err, pokemon) => {

            if (err) {
                return res.status(500).send(err.message);
            }

            if (!pokemon) {
                return res.status(404).send('Pokemon not found');
            }

            res.render('pokemon/edit', {
                pokemon: pokemon
            });
        }
    );
});

router.post('/:id/edit', (req, res) => {

    db.run(
        `UPDATE pokemon
         SET name = ?, type = ?, level = ?
         WHERE id = ?`,
        [
            req.body.name,
            req.body.type,
            req.body.level,
            req.params.id
        ],
        (err) => {

            if (err) {
                return res.status(500).send(err.message);
            }

            res.redirect('/pokemon');
        }
    );
});

router.get('/:id', (req, res) => {

    db.get(
        'SELECT * FROM pokemon WHERE id = ?',
        [req.params.id],
        (err, pokemon) => {

            if (err) {
                console.error(err);
                return res.status(500).send(err.message);
            }

            if (!pokemon) {
                return res.status(404).send('Pokemon not found');
            }

            res.render('pokemon/show', {
                pokemon: pokemon
            });
        }
    );
});

router.post('/:id/delete', (req, res) => {

    db.run(
        'DELETE FROM pokemon WHERE id = ?',
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).send(err.message);
            }

            res.redirect('/pokemon');
        }
    );
});

module.exports = router;