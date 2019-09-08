'use strict';
const express = require('express');
const session = require('express-session'); // TODO use this
const bodyParser = require("body-parser");
const mysql = require('mysql2/promise');
const fs = require('file-system');
const bcrypt = require('bcryptjs');
// TODO replace with bcrypt? Seems -js had last release 3 years ago...

const app = express();
app.use(bodyParser.json());

// from express-session's thing
const sess = {
    secret: 'Let the Dragon ride again on the winds of time',
    resave: true,
    saveUninitialized: true,
    cookie: {}
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));

const conf = JSON.parse(fs.readFileSync('db.json', 'utf8'));
const pool = mysql.createPool({
    ...conf,
    connectionLimit: 9,
    waitForConnections: true,
    debug: false
});

/*----------------- GET ROWS -----------------*/

const getRows = async (endpoint, query) => {
    try {
        let connection = await pool.getConnection();
        let [rows, fields] = await connection.query(query);
        connection.release();
        return rows;
    } catch (e) {
        console.error(e, `SQL query at ${endpoint} failed with ${e.code}`);
        throw e;
    }
};

const multiRowResources = [
    { endpoint: '/articles', query: 'SELECT * FROM articles_view' },
    { endpoint: '/front_page', query: 'SELECT * FROM front_page' },
    { endpoint: '/news_feed', query: 'SELECT * FROM news_feed' },
    { endpoint: '/users', query: 'SELECT user_id, name FROM users' },
];

for (const { endpoint, query } of multiRowResources) {
    app.get(endpoint, async (req, res/*, next*/) => {
        console.log(`Got GET request at ${endpoint}`);
        try {
            const rows = await getRows(endpoint, query);
            console.log(`${rows.length} rows found`);
            res.status(200).json(rows);
        } catch (e) {
            console.trace(e, `Error occurred during ${endpoint}:`);
            res.status(503).send('GET request failed');
            //next(e);
        }
    });
}

/*----------------- GET ONE ROW -----------------*/

const getRow = async (endpoint, query, {id}) => {
    try {
        let connection = await pool.getConnection();
        let [rows, fields] = await connection.execute(query, [id]);
        connection.release();
        return rows;
    } catch (e) {
        console.error(e, `SQL query at ${endpoint} failed with ${e.code}`);
        throw e;
    }
};

// wrapping regex in () after id name specifies what paths to accept
// which means /users/:id(\d+) only accepts numbers, directing /users/olegunnar to the error page
// I somehow managed to get it to accept usernames with %20 but the group needs to be (%20 w/o the last )
// see https://www.npmjs.com/package/path-to-regexp for info
// "All parameters can have a custom regexp, which overrides the default match ([^/]+)."
// --> do I need to prohibit / ? nah.
const singleRowResources = [
    { endpoint: '/users/:id(\\d+)', query: 'SELECT user_id, name FROM users WHERE user_id = ?' },
    { endpoint: '/users/:id([\\w|(%20]+)', query: 'SELECT user_id, name FROM users WHERE name = ?' }, // TODO is this needed?
    { endpoint: '/articles/:id(\\d+)', query: 'SELECT * FROM articles_view WHERE article_id = ?' },
];

for (const { endpoint, query } of singleRowResources) {
    app.get(endpoint, async (req, res, next) => {
        try {
            console.log(`Got GET request at ${endpoint}`);
            const rows = await getRow(endpoint, query, { id: req.params.id });
            console.log(`${(rows.length === 1)? 'Found one row at' : 'Found nothing at'} ${endpoint}`);
            if (rows.length === 0) {
                res.status(404).json({ error: 'GET request failed, invalid ID' });
            } else {
                res.status(200).json(rows);
            }
        } catch (e) {
            console.error(e, 'Error occured during /users/:id');
            res.status(404).json({ error: 'GET failed' });
            //next(e);
        }
    });

}

/*----------------- POST REQUESTS -----------------*/

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

app.post('/users', async (req, res) => {
    console.log(`Got POST request to add ${req.body.name} to users`);
    try {
        const user = await addUser({ name: req.body.name, password: req.body.password });
        res.status(201).send('POST successful');
    } catch (e) {
        console.trace(e, 'Error occured during /users/:id');
        //res.json({ error: 'failed to establish DB connection' });
        //this will eventually be handled by your error handling middleware
        res.json({ error: e.toString()}); // todo RLY?
    }
});

/*----------------- LOGIN -----------------*/

const authPost = (req, res, next) => {
    if (req.session) {
        return next();
    } else {
        return res.status(401).json({ error: 'User not logged in; cannot access resource' });
    }
}

const authLogin = (req, res, next) => {
    if (req.session) {
        return next();
    } else {
        return res.status(401).json({ error: 'User not logged in; cannot access resource' });
    }
}

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});

const getUserByName = async ({name}) => {
    try {
        let connection = await pool.getConnection();
        let [rows, fields] = await connection.execute('SELECT user_id, name, password FROM users WHERE name = ?', [name]);
        connection.release();
        return rows;
    } catch (e) {
        console.error(`Failed to execute query during login, with ${e.code}`, e);
        throw e;
    }
}

// check req.session.userId against user_id in, say, article entry to verify that the user can update this one?

app.post('/login', async (req, res) => {
    const { password, name } = req.body;
    console.log(`Got login request for user ${name}`);
    try {
        const rows = await getUserByName({ name: name });
        if (rows.length === 1) {
            console.log(rows);
            const user = rows[0];
            if (password && await bcrypt.compare(password, user.password)) {
                req.session.user = name;
                req.session.userId = user.user_id;
                res.status(201).send('Login successful');
            } else {
                res.status(401).json({ error: 'Login failed, wrong credentials' });
            }
        }
    } catch (e) {
        console.trace(e, 'Error occured during login');
        res.status(401).json({ error: 'Error occured during login'});
    }
})

console.log(`Server starting.\nUsing DB at ${conf.host}.`);

let server = app.listen(8080);
