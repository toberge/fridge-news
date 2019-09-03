'use strict';
const express = require('express');
const mysql = require('mysql');
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

/* possible better thing:
 * app.configure(function(){
 * app.use(express.bodyParser());
 * app.use(app.router);
 * });
 * ...and port can be defined better, of course
 */

const fs = require('file-system');
const conf = JSON.parse(fs.readFileSync('db.json', 'utf8'));

const pool = mysql.createPool(conf);

app.get('/articles', (req, res) => {
    console.log('got /articles request');
    pool.getConnection((err, connection) => {
        console.log('Got connection!');
        if (err) {
            console.log(err, 'connection failure');
            res.json({ error: 'failed to establish DB connection' });
        } else {
            connection.query(
                'SELECT * FROM articles',
                (err, rows) => {
                    connection.release();
                    if (err) {
                        console.log(err, 'query error');
                        res.json({ error: 'query error' });
                    } else {
                        console.log(rows);
                        res.json(rows);
                    }
                }
            ); // end query
        }
    }); // end getCOnnection
});

app.get('/articles/top', (req, res) => {
    console.log('got /articles/top request');
    pool.getConnection((err, connection) => {
        console.log('Got connection!');
        if (err) {
            console.log(err, 'connection failure');
            res.json({ error: 'failed to establish DB connection' });
        } else {
            connection.query(
                'SELECT * FROM articles_view',
                (err, rows) => {
                    connection.release();
                    if (err) {
                        console.log(err, 'query error');
                        res.json({ error: 'query error' });
                    } else {
                        console.log(rows);
                        res.json(rows);
                    }
                }
            ); // end query
        }
    }); // end getCOnnection
});

app.post('/users', (req, res) => {
    console.log('got /users request');
    pool.getConnection((err, connection) => {
        console.log('Got connection!');
        if (err) {
            console.log(err, 'connection failure');
            res.json({ error: 'failed to establish DB connection' });
        } else {
            connection.query(
                'INSERT INTO users(name) VALUES (?)',
                req.body.name,
                err => {
                    connection.release();
                    if (err) {
                        console.log(err, 'query error');
                        res.json({ error: 'query error' });
                    } else {
                        console.log('POST request succeeded');
                        res.send('POST successful');
                    }
                }
            ); // end query
        }
    }); // end getCOnnection
});

app.get('/users', (req, res) => {
    console.log('got /users request');
    pool.getConnection((err, connection) => {
        console.log('Got connection!');
        if (err) {
            console.log(err, 'connection failure');
            res.json({ error: 'failed to establish DB connection' });
        } else {
            connection.query(
                'SELECT * FROM users',
                (err, rows) => {
                    connection.release();
                    if (err) {
                        console.log(err, 'query error');
                        res.json({ error: 'query error' });
                    } else {
                        console.log(rows);
                        res.json(rows);
                    }
                }
            ); // end query
        }
    }); // end getCOnnection
});

console.log(`Server starting.\nUsing DB at ${conf.host}.`);

let server = app.listen(8080);
