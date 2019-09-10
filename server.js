'use strict';
const express = require('express');
const session = require('express-session'); // TODO don't actually use this next time, use JWT stuffs
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

/*----------------- SQL shortcuts -----------------*/

const singleRowQuery = async (query, ...params) => {
    try {
        let connection = await pool.getConnection();
        let [rows, fields] = await connection.execute(query, params);
        connection.release();
        return rows[0];
    } catch (e) {
        console.error(e, `SQL query ${query} failed with ${e.code}`);
        throw e;
    }
};

const multiRowQuery = async (query, ...params) => {
    try {
        let connection = await pool.getConnection();
        let [rows, fields] = await connection.execute(query, params);
        connection.release();
        return rows;
    } catch (e) {
        console.error(e, `SQL query ${query} failed with ${e.code}`);
        throw e;
    }
};

const updateQuery = async (query, ...params) => {
    let connection = null;
    try {
        connection = await pool.getConnection();
        return await connection.execute(query, params);
    } catch (e) {
        console.error(e, `SQL query ${query} failed with ${e.code}`);
        throw e;
    } finally {
        if (connection) connection.release();
    }
}

/*----------------- LOGIN -----------------*/

const authLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.status(401).json({ error: 'User not logged in; cannot access resource' });
    }
}

const authOwnsArticle = async (req, res, next) => {
    if (req.session) {
        try {
            if (req.session.userId === await singleRowQuery( 'SELECT user_id FROM articles WHERE article_id = ?', [ req.params.id ]).user_id) {
                return next();
            } else {
                return res.status(401).json({ error: 'User is not author of article' });
            }
        } catch (e) {
            console.trace('Error occured during author check');
            return res.status(400).json({ error: 'Could not check if user is author' })
        }
    } else {
        return res.status(401).json({ error: 'User not logged in or is not author of article' });
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
    if (!req.body.name || !req.body.password)return res.status(400).json({ error: 'Insufficient data in request body' });
    const { password, name } = req.body;
    console.log(`Got login request for user ${name}`);
    try {
        const rows = await getUserByName({ name: name });
        if (rows.length === 1) {
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
        console.trace('Error occured during login', e);
        res.status(401).json({ error: 'Error occured during login'});
    }
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
    app.get(endpoint, async (req, res) => {
        console.log(`Got GET request at ${endpoint}`);
        try {
            const rows = await getRows(endpoint, query);
            console.log(`${rows.length} rows found`);
            res.status(200).json(rows);
        } catch (e) {
            console.trace(e, `Error occurred during ${endpoint}:`);
            res.status(503).send('GET request failed');
        }
    });
}

app.get('/categories/:name([\\w]+)', async (req, res) => {
    console.log(`Got GET request at /categories/:name`);
    try {
        const rows = await multiRowQuery('SELECT * FROM articles_view WHERE category = ?', req.params.name);
        console.log(`${rows.length} rows found`);
        res.status(200).json(rows);
    } catch (e) {
        console.trace(e, `Error occurred during category search`);
        res.status(503).send('GET request failed');
    }
});

app.get('/articles/:id(\\d+)/comments', async (req, res) => {
    console.log(`Got GET request at ${req.path}`);
    try {
        const rows = await multiRowQuery('SELECT * FROM comments WHERE article_id = ?', req.params.id);
        console.log(`${rows.length} rows found`);
        res.status(200).json(rows);
    } catch (e) {
        console.trace(e, `Error occurred while fetching comments`);
        res.status(503).send('GET request failed');
    }
});

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
    app.get(endpoint, async (req, res) => {
        try {
            console.log(`Got GET request at ${endpoint}`);
            const rows = await getRow(endpoint, query, { id: req.params.id });
            console.log(`${(rows.length === 1)? 'Found one row at' : 'Found nothing at'} ${endpoint}`);
            if (rows.length !== 1) {
                res.status(404).json({ error: 'GET request failed, invalid ID' });
            } else {
                res.status(200).json(rows[0]);
            }
        } catch (e) {
            console.error(e, 'Error occured during /users/:id');
            res.status(404).json({ error: 'GET failed' });
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

app.post('/articles', authLogin, async (req, res) => {
    if (!req.body.title) return res.status(400).json({ error: 'Insufficient data in request body' });
    const { title, media, content, importance, category } = req.body;
    console.log(`Got POST request from ${req.session.user} to add ${title} as article`)
    try {
        if (await updateQuery('INSERT INTO articles(user_id, title, media, content, importance, category) VALUES(?, ?, ?, ?, ?, ?)',
                        req.session.userId, title, media, content, importance, category)) {
            res.status(201).json({ message: 'POST successful'});
        } else {
            res.status(400).json({ message: 'Could not POST article'})
        }
    } catch (e) {
        console.trace('Failed to POST article');
        res.status(400).json({ error: 'Failed to POST article' });
    }
});

app.post('/articles/:id(\\d+)/comments', authLogin, async (req, res) => {
    if (!req.body.title || !req.body.content) return res.status(400).json({ error: 'Insufficient data in request body' });
    const { title, content } = req.body;
    console.log(`Got POST request from ${req.session.user} to add ${title} as comment to article ${req.params.id}`)
    try {
        if (await updateQuery('INSERT INTO comments(article_id, user_id, title, content) VALUES(?, ?, ?, ?)',
                        req.params.id, req.session.userId, title, content)) {
            res.status(201).json({ message: 'POST successful'});
        } else {
            res.status(400).json({ message: 'Could not POST comment'})
        }
    } catch (e) {
        console.trace('Failed to POST comment');
        res.status(400).json({ error: 'Failed to POST comment' });
    }
});

// will fail if used as update
app.post('/articles/:id(\\d+)/ratings', authLogin, async (req, res) => {
    if (!req.body.value) return res.status(400).json({ error: 'Insufficient data in request body' });
    console.log(`Got POST request from ${req.session.user} to rate article ${req.params.id} a ${req.body.value} out of 5`)
    try {
        if (await updateQuery('INSERT INTO ratings(article_id, user_id, value) VALUES(?, ?, ?)',
            req.params.id, req.session.userId, req.body.value)) {
            res.status(201).json({ message: 'POST successful'});
        } else {
            res.status(400).json({ message: 'Could not POST rating'})
        }
    } catch (e) {
        console.trace('Failed to POST rating');
        res.status(400).json({ error: 'Failed to POST rating' });
    }
});

// uhhhhhh should I revert to just POST?
app.put('/articles/:articleId(\\d+)/ratings/:userId(\\d+)', authLogin, async (req, res) => {
    // the session has number, param has string
    if (req.session.userId != req.params.userId) return res.status(400).json({ error: 'Cannot change another user\'s rating' });
    if (!req.body.value) return res.status(400).json({ error: 'Insufficient data in request body' });
    console.log(`Got UPDATE request from ${req.session.user} to change rating for article ${req.params.articleId} to ${req.body.value} out of 5`)
    try {
        if (await updateQuery('UPDATE ratings SET value = ? WHERE article_id = ? AND user_id = ?',
            req.body.value, req.params.articleId, req.params.userId)) {
            res.status(201).json({ message: 'UPDATE successful'});
        } else {
            res.status(400).json({ message: 'Could not UPDATE rating'})
        }
    } catch (e) {
        console.trace('Failed to UPDATE rating');
        res.status(400).json({ error: 'Failed to UPDATE rating' });
    }
});



/*----------------- THAT'S IT -----------------*/

let server = app.listen(8080);

console.log(`Server started.\nUsing DB at ${conf.host}.`);
