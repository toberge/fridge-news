'use strict';
const express = require('express');
const bodyParser = require("body-parser");
const mysql = require('mysql2/promise');
const fs = require('file-system');
var bcrypt = require('bcryptjs');

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

// ORIGINAL by-Nils'-tutorial things

/*app.get('/articles', (req, res) => {
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
});*/

/*app.post('/users', (req, res) => {
    console.log('got /users request');
    // THIS SHOULD NOT HAPPEN HERE
    let hash = bcrypt.hashSync(req.body.password, 10);
    pool.getConnection((err, connection) => {
        console.log('Got connection!');
        if (err) {
            console.log(err, 'connection failure');
            res.json({ error: 'failed to establish DB connection' });
        } else {
            connection.execute(
                'INSERT INTO users(name, password) VALUES (?, ?)',
                [req.body.name, hash],
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
});*/

/*app.get('/users', (req, res) => {
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
});*/

/* FINALLY YOU DIE
const fetchUser = async ({id}) => {
    console.log(`got ${id}`);

    pool.getConnection((err, connection) => {
        console.log('Got connection!');
        if (err) {
            console.log(err, 'connection failure');
        } else {
            connection.execute(
                'SELECT * FROM users WHERE user_id = ?',
                [id],
                (err, rows) => {
                    connection.release();
                    if (err) {
                        console.error(err, 'query error');
                        return null;
                    } else {
                        console.log(rows);
                        return rows;
                    }
                }
            ); // end query
        }
    }); // end getCOnnection
};
*/

// NEW async await things

/*app.get('/articles', async (req, res, next) => {
    console.log('Got /articles request');
    try {
        const rows = await getRows('/articles', 'SELECT * FROM articles');
        console.log(rows);
        res.json(rows);
    } catch (e) {
        console.error(e, 'Error occured during /articles');
        next(e);
    }
});

app.get('/frontpage', async (req, res, next) => {
    console.log('Got /frontpage request');
    try {
        const rows = await getRows('/frontpage', 'SELECT * FROM articles_view');
        console.log(rows);
        res.json(rows);
    } catch (e) {
        console.error(e, 'Error occured during /frontpage');
        next(e);
    }
});*/



/*const fetchArticles = async () => {
    try {
        let connection = await pool.getConnection();
        let [rows, fields] = await connection.query('SELECT * FROM articles');
        connection.release();
        return rows;
    } catch (e) {
        console.error(e, `fetchArticles failed with ${e.code}`);
        throw e;
    }
};

app.get('/articles', async (req, res, next) => {
    console.log('Got /articles request');
    try {
        const articles = await fetchArticles();
        console.log(articles);
        res.json(articles);
    } catch (e) {
        console.error(e, 'Error occured during /articles');
        next(e);
    }
});*/

/*const fetchTopArticles = async () => {
    try {
        let connection = await pool.getConnection();
        let [rows, fields] = await connection.query('SELECT * FROM articles_view');
        connection.release();
        return rows;
    } catch (e) {
        console.error(e, `fetchTopArticles failed with ${e.code}`);
        throw e;
    }
};

app.get('/frontpage', async (req, res, next) => {
    console.log('Got /frontpage request');
    try {
        const frontpage = await fetchTopArticles();
        console.log(frontpage);
        res.json(frontpage);
    } catch (e) {
        console.error(e, 'Error occured during /frontpage');
        next(e);
    }
});*/

/*const fetchUsers = async () => {
    try {
        let connection = await pool.getConnection();
        let [rows, fields] = await connection.query('SELECT * FROM users');
        connection.release();
        return rows;
    } catch (e) {
        console.trace(); // TODO check if this works
        console.error(e, `fetchUsers failed with ${e.code}`);
        throw e;
    }
};

app.get('/users', async (req, res, next) => {
    console.log('Got /users request');
    try {
        const users = await fetchUsers();
        console.log(users);
        res.json(users);
    } catch (e) {
        console.trace(); // TODO check if this works
        console.error(e, 'Error occured during /users');
        next(e);
    }
});*/

// IMPROVED to have simple GET requests summarized in an array:

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
