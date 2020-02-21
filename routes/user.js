var express = require('express');
var { Pool } = require('pg');
var DB = require('../config/config').DB;

var app = express();

// DB Connection
const pool = new Pool(DB);

// =======================================
// Create
// =======================================
app.post('/', (req, res) => {
    var body = req.body;
    const text = 'INSERT INTO public.user(name) VALUES($1)'
    const values = [body.name]
    pool.query(text, values, (err, q) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error',
                    errors: err.stack
                });
            }
            res.status(200).json({
                ok: true,
                res: 'User created!'
            });
        })
});

// =======================================
// Read
// =======================================
app.get('/', (req, res) => {
    const text = 'SELECT * FROM public.user'
    pool.query(text, (err, q) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error',
                errors: err.stack
            });
        }
        res.status(200).json({
            ok: true,
            res: q.rows
        });
    })
});

// =======================================
// Update
// =======================================
app.put('/', (req, res) => {
    var body = req.body;
    const text = 'UPDATE public.user set name = $1 WHERE id = $2'
    const values = [body.name, body.id]
    pool.query(text, values, (err, q) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error',
                errors: err.stack
            });
        }
        res.status(200).json({
            ok: true,
            res: 'User updated!'
        });
    })
});

// =======================================
// Delete
// =======================================
app.delete('/:id', (req, res) => {
    var id = req.params.id;
    var text = 'SELECT * FROM public.user WHERE id = $1'
    const value = [id]
    pool.query(text, value, (err, q) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error',
                errors: err.stack
            });
        }
        var user = q.rows[0];
        if (!user) {
            return res.status(400).json({
                ok: false,
                mensaje: 'The user with ID: ' + id + ' doesn\'t exist.'
            });
        }
        text = 'DELETE FROM task WHERE user_id = $1'
        pool.query(text, value, (err, q) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error',
                    errors: err.stack
                });
            }
            text = 'DELETE FROM public.user WHERE id = $1'
            pool.query(text, value, (err, q) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error',
                        errors: err.stack
                    });
                }
                res.status(200).json({
                    ok: true,
                    res: 'User deleted!'
                });
            })
        })
    })
});

module.exports = app;