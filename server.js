'use strict';
const express = require('express');
const bodyParser = require("body-parser");
const mysql = require('mysql2/promise');
const fs = require('file-system');
const bcrypt = require('bcryptjs');
// TODO replace with bcrypt? Seems -js had last release 3 years ago...

const app = express();
app.use(bodyParser.json());

/* possible better thing:
 * app.configure(function(){
 * app.use(express.bodyParser());
 * app.use(app.router);
 * });
 * ...and port can be defined better, of course
 */

const conf = JSON.parse(fs.readFileSync('db.json', 'utf8'));
const pool = mysql.createPool({
    ...conf,
    connectionLimit: 9,
    waitForConnections: true,
    debug: false
});



const getRows = async (enpoint, query) => {
    try {
        let connection = await pool.getConnection();
        let [rows, fields] = await connection.query(query);
        connection.release();
        return rows;
    } catch (e) {
        console.error(`SQL query ${enpoint} failed with ${e.code}`, e);
        throw e;
    }
};

const resources = [
    { endpoint: '/articles', query: 'SELECT * FROM articles' },
    { endpoint: '/frontpage', query: 'SELECT * FROM articles_view' },
    { endpoint: '/users', query: 'SELECT * FROM users' },
];

for (const item of resources) {
    const { endpoint, query } = item;
    app.get(endpoint, async (req, res, next) => {
        console.log(`Got ${endpoint} request`);
        try {
            const rows = await getRows(endpoint, query);
            console.log(rows);
            res.json(rows);
        } catch (e) {
            console.error(`Error occured during ${endpoint}:`, e);
            next(e);
        }
    });
}



const addUser = async ({name, password}) => {
    try {
        let hash = await bcrypt.hash(password, 10);
        let connection = await pool.getConnection();
        let [rows, fields] = await connection.execute('INSERT INTO users(name, password) VALUES (?, ?)', [name, hash]);
        connection.release();
        return rows;
    } catch (e) {
        console.error(`addUser failed with ${e.code}`, e);
        throw e;
    }
};

app.post('/users', async (req, res, next) => {
    console.log(`Got POST request to add ${req.body.name} to users`);
    try {
        const user = await addUser({ name: req.body.name, password: req.body.password });
        res.send('POST successful');
    } catch (e) {
        //console.error(e, 'Error occured during /users/:id');
        console.trace();
        //res.json({ error: 'failed to establish DB connection' });
        //this will eventually be handled by your error handling middleware
        next(e);
    }
});

const fetchUser = async ({id}) => {
    try {
        let connection = await pool.getConnection();
        let [rows, fields] = await connection.execute('SELECT user_id, name FROM users WHERE user_id = ?', [id]);
        connection.release();
        return rows;
    } catch (e) {
        console.error(e, `getUser failed with ${e.code}`);
        throw e;
    }
};

app.get('/users/:id', async (req, res, next) => {
    try {
        const user = await fetchUser({ id: req.params.id });
        console.log("hello " + user);
        res.json(user);
    } catch (e) {
        console.error(e, 'Error occured during /users/:id');
        //res.json({ error: 'failed to establish DB connection' });
        //this will eventually be handled by your error handling middleware
        next(e);
    }
});


console.log(`Server starting.\nUsing DB at ${conf.host}.`);

let server = app.listen(8080);
