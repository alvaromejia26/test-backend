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
    var text = 'SELECT * FROM public.user WHERE id = $1'
    const value = [body.user_id]
    pool.query(text, value, (err, q) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error',
                errors: err.stack
            });
        }
        var user = q.rows[0];
        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'The user with ID: ' + body.user_id + ' doesn\'t exist.'
            });
        }
        text = 'INSERT INTO task(description, user_id) VALUES($1, $2)'
        var values = [body.description, body.user_id]
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
                res: 'Task created!'
            });
        })
    })
});

// =======================================
// Read
// =======================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    const text = 'SELECT task.id, task.description, task.state, public.user.name as user FROM public.task, public.user WHERE ' +
                    'public.user.id = task.user_id AND task.user_id = $1'
    var value = [id]
    pool.query(text, value, (err, q) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error',
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
app.put('/:id', (req, res) => {
    var body = req.body;
    var id = req.params.id;
    var text = 'SELECT * FROM task WHERE id = $1'
    const value = [id]
    pool.query(text, value, (err, q) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error',
                errors: err.stack
            });
        }
        var task = q.rows[0];
        if (!task) {
            return res.status(400).json({
                ok: false,
                message: 'The task with ID: ' + id + ' doesn\'t exist.'
            });
        }
        const text = 'UPDATE task set description = $1, state = $2 WHERE id = $3'
        const values = [body.description, body.state, id]
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
                res: 'Task updated!'
            });
        })
    })
});

module.exports = app;