// @flow
'use strict';
const express = require('express');
const path = require('path');
const session = require('express-session'); // TODO don't actually use this next time, use JWT stuffs
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const fs = require('file-system');
const bcrypt = require('bcryptjs');
// TODO replace with bcrypt? Seems -js had last release 3 years ago...

const publicPath = path.join(__dirname, '../frontend/build');
// const publicPath = path.join(__dirname, '../frontend/public');
const app = express();
app.use(express.static(publicPath));
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

const conf = JSON.parse(fs.readFileSync('database/properties.json', 'utf8'));
const pool = mysql.createPool({
  ...conf,
  connectionLimit: 9,
  waitForConnections: true,
  debug: false
});

/* TODO the mess */

const ArticleDAO = require('./database/ArticleDAO');
let articleDAO = new ArticleDAO(pool);

const performSingleRowQuery = async (res, func, context: string, ...params) => {
  func(...params)
    .then(rows => {
      if (rows) {
        res.status(200).json(rows);
      } else {
        res.send(404).json({ error: `GET request failed, invalid ID for ${context}`});
      }
    })
    .catch(e => {
      console.error(e, `Error occured while fetching ${context}`);
      res.status(404).json({ error: 'GET failed', details: e.toString() });
    });
};

app.get('/articles', (req, res) => {

  articleDAO.getAll()
    .then(rows => {
      if (rows) {
        res.status(200).json(rows);
      } else {
        res.send(501);
      }
    })
    .catch(e => {
      console.trace(e);
      res.status(501).json({ error: 'blablabla', details: e });
    });
});

const things = [
  articleDAO.getOne
]
app.get('/articles/:id(\\d+)', async (req, res) => {
  /*try {
    const rows = await things[0](req.params.id);
    console.log(rows);
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.send(501);
    }
  } catch (e) {
    console.trace(e);
    res.status(501).json({ error: 'blablabla', details: e.toString() });
  }*/
  performSingleRowQuery(res, articleDAO.getOne, 'articles', parseInt(req.params.id))
})

/* TODO end of mess... */

/* ----------------- SQL shortcuts ----------------- */

const singleRowQuery = async (query, ...params) => {
  let connection = null;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(query, params);
    // connection.release();
    return rows[0];
  } catch (e) {
    console.error(e, `SQL query ${query} failed with ${e.code}`);
    throw e;
  } finally {
    if (connection) connection.release();
  }
};

const multiRowQuery = async (query, ...params) => {
  let connection = null;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(query, params);
    // connection.release();
    return rows;
  } catch (e) {
    console.error(e, `SQL query ${query} failed with ${e.code}`);
    throw e;
  } finally {
    if (connection) connection.release();
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
};

/* ----------------- LOGIN ----------------- */

const authLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).json({ error: 'User not logged in; cannot access resource' });
  }
};

/*
const authOwnsArticle = async (req, res, next) => {
  if (req.session) {
    try {
      if (req.session.userId === await singleRowQuery('SELECT user_id FROM articles WHERE article_id = ?', [req.params.id]).user_id) {
        return next();
      } else {
        return res.status(401).json({ error: 'User is not author of article' });
      }
    } catch (e) {
      console.trace('Error occured during author check');
      return res.status(400).json({ error: 'Could not check if user is author' });
    }
  } else {
    return res.status(401).json({ error: 'User not logged in or is not author of article' });
  }
};
*/

app.post('/logout', function (req, res) {
  if (req.session.userId) {
    req.session.destroy();
    res.status(201).json({ message: 'Logged out' });
  } else {
    res.status(401).json({ error: 'Was not logged in in the first place' });
  }
});

const getUserByName = async ({ name }) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT user_id, name, password FROM users WHERE name = ?', [name]);
    connection.release();
    return rows;
  } catch (e) {
    console.error(`Failed to execute query during login, with ${e.code}`, e);
    throw e;
  }
};

// check req.session.userId against user_id in, say, article entry to verify that the user can update this one?

app.post('/login', async (req, res) => {
  if (!req.body.name || !req.body.password) return res.status(400).json({ error: 'Insufficient data in request body' });
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
    } else {
      res.status(401).json({ error: 'Login failed, wrong credentials' });
    }
  } catch (e) {
    console.trace('Error occured during login', e);
    res.status(401).json({ error: 'Error occured during login' });
  }
});

/* ----------------- GET ROWS ----------------- */

const multiRowResources = [
  //{ endpoint: '/articles', query: 'SELECT * FROM articles_view' },
  { endpoint: '/articles/front_page', query: 'SELECT * FROM front_page' },
  { endpoint: '/articles/news_feed', query: 'SELECT * FROM news_feed' },
  { endpoint: '/users', query: 'SELECT user_id, name FROM users' }
];

for (const { endpoint, query } of multiRowResources) {
  app.get(endpoint, async (req, res) => {
    console.log(`Got GET request at ${endpoint}`);
    try {
      const rows = await multiRowQuery(query);
      console.log(`${rows.length} rows found`);
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(503).json({ error: `Nothing found at ${endpoint}, is the database down?` });
      }
    } catch (e) {
      console.trace(e, `Error occurred during ${endpoint}:`);
      res.status(503).send('GET request failed');
    }
  });
}

app.get('/articles/categories/:name', async (req, res) => { // removed ([\w]+)
  console.log('Got GET request at /categories/:name');
  try {
    const rows = await multiRowQuery('SELECT * FROM articles_condensed WHERE category = ?', req.params.name);
    console.log(`${rows.length} rows found`);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      switch (req.params.name) {
        case 'news':
        case 'culture':
        case 'science':
        case 'politics':
          res.status(200).json([]);
          break;
        default:
          res.status(404).json({ error: 'No such category or no articles in category' });
      }
    }
  } catch (e) {
    console.trace(e, 'Error occurred during category search');
    res.status(503).send('GET request failed');
  }
});

app.get('/articles/:id(\\d+)/comments', async (req, res) => {
  console.log(`Got GET request at ${req.path}`);
  try {
    const rows = await multiRowQuery('SELECT * FROM comments WHERE article_id = ?', req.params.id);
    console.log(`${rows.length} rows found`);
    // gotta send the data even if there is none, let the client handle it
    res.status(200).json(rows);
  } catch (e) {
    console.trace(e, 'Error occurred while fetching comments');
    res.status(503).send('GET request failed');
  }
});

/* ----------------- GET ONE ROW ----------------- */

// wrapping regex in () after id name specifies what paths to accept
// which means /users/:id(\d+) only accepts numbers, directing /users/olegunnar to the error page
// I somehow managed to get it to accept usernames with %20 but the group needs to be (%20 w/o the last )
// see https://www.npmjs.com/package/path-to-regexp for info
// "All parameters can have a custom regexp, which overrides the default match ([^/]+)."
// --> do I need to prohibit / ? nah.
const singleRowResources = [
  { endpoint: '/users/:id(\\d+)', query: 'SELECT user_id, name FROM users WHERE user_id = ?' },
  { endpoint: '/users/:id([\\w|(%20]+)', query: 'SELECT user_id, name FROM users WHERE name = ?' }, // TODO is this needed?
  { endpoint: '/articles/:id(\\d+)', query: 'SELECT * FROM articles_view WHERE article_id = ?' }
];

for (const { endpoint, query } of singleRowResources) {
  app.get(endpoint, async (req, res) => {
    try {
      console.log(`Got GET request at ${endpoint}`);
      const row = await singleRowQuery(query, req.params.id);
      if (row) {
        console.log(`Found something at ${endpoint}`);
        res.status(200).json(row);
      } else {
        res.status(404).json({ error: 'GET request failed, invalid ID' });
      }
      /* console.log(`${(rows.length === 1)? 'Found one row at' : 'Found nothing at'} ${endpoint}`);
            if (rows.length !== 1) {
                res.status(404).json({ error: 'GET request failed, invalid ID' });
            } else {
                res.status(200).json(rows[0]);
            } */
    } catch (e) {
      console.error(e, `Error occured during ${endpoint}`);
      res.status(404).json({ error: 'GET failed' });
    }
  });
}

app.get('/articles/:articleId/comments/:commentId', async (req, res) => {
  try {
    console.log(`Got GET request at ${req.path}`);
    const row = await singleRowQuery('SELECT * FROM comments WHERE /*article_id = ? AND*/ comment_id = ?', /* req.params.articleId, */ req.params.commentId);
    if (row) {
      console.log('Found a comment');
      res.status(200).json(row);
    } else {
      res.status(404).json({ error: 'GET request failed, invalid ID' });
    }
  } catch (e) {
    console.error(e, 'Error occured during ');
    res.status(404).json({ error: 'GET failed' });
  }
});

/* ----------------- POST REQUESTS ----------------- */

const addUser = async ({ name, password }) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('INSERT INTO users(name, password) VALUES (?, ?)', [name, hash]);
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
    await addUser({ name: req.body.name, password: req.body.password });
    res.status(201).send('POST successful');
    // okay, don't forget bcrypting next time you change this!
    /* if (await updateQuery('INSERT INTO users(name, password) VALUES (?, ?)', req.body.name, req.body.password)) {
            res.status(201).send('POST successful');
        } else {
            res.status(400).json({ error: 'Failed to POST user' });
        } */
  } catch (e) {
    console.trace(e, 'Error occured during /users/:id');
    // res.json({ error: 'failed to establish DB connection' });
    // this will eventually be handled by your error handling middleware
    res.json({ error: e.toString() }); // todo RLY?
  }
});

// TODO put the auths back in when refactored & all done
app.post('/articles', /*authLogin, */async (req, res) => {
  const { user_id, title, picture_path, picture_alt, picture_caption, content, importance, category } = req.body;
  if (!(user_id && title && content && importance && category)) return res.status(400).json({ error: 'Insufficient data in request body' });
  // console.log(`Got POST request from ${req.session.user} to add ${title} as article`);
  console.log(`Got POST request from ${user_id} to add ${title} as article`);
  try {
    const { insertId } = await articleDAO.addOne({user_id, title, picture_path, picture_alt, picture_caption, content, importance, category});
    if (insertId > 0) {
      res.status(201).json({ message: 'POST successful', id: insertId });
    } else {
      res.status(400).json({ message: 'Could not POST article' });
    }
  } catch (e) {
    console.trace(e, 'Failed to POST article');
    res.status(400).json({ error: 'Failed to POST article' });
  }
});

app.put('/articles/:id(\\d+)', async (req, res) => {
  const { title, picture_path, picture_alt, picture_caption, content, importance, category } = req.body;
  if (!(title && content && importance && category)) return res.status(400).json({ error: 'Insufficient data in request body' });
  const id = parseInt(req.params.id);
  console.log(`Got PUT request to update article ${title}`);
  try {
    let fields = await articleDAO.updateOne({ article_id: id, title, picture_path, picture_alt, picture_caption, content, importance, category});
    if (fields.affectedRows === 1) {
      res.status(200).json({ message: 'PUT successful' });
    } else {
      res.status(400).json({ message: 'Could not PUT article' });
    }
  } catch (e) {
    console.trace(e, 'Failed to PUT article');
    res.status(400).json({ error: 'Failed to PUT article' });
  }
});

app.post('/articles/:id(\\d+)/comments', /*authLogin, */async (req, res) => {
  if (!req.body.title || !req.body.content) return res.status(400).json({ error: 'Insufficient data in request body' });
  const { title, content } = req.body;
  console.log(`Got POST request from ${req.session.user} to add ${title} as comment to article ${req.params.id}`);
  try {
    if (await updateQuery('INSERT INTO comments(article_id, user_id, title, content) VALUES(?, ?, ?, ?)',
      req.params.id, req.session.userId, title, content)) {
      res.status(201).json({ message: 'POST successful' });
    } else {
      res.status(400).json({ message: 'Could not POST comment' });
    }
  } catch (e) {
    console.trace('Failed to POST comment');
    res.status(400).json({ error: 'Failed to POST comment' });
  }
});

// will fail if used as update
app.post('/articles/:id(\\d+)/ratings', /*authLogin, */async (req, res) => {
  if (!req.body.value) return res.status(400).json({ error: 'Insufficient data in request body' });
  console.log(`Got POST request from ${req.session.user} to rate article ${req.params.id} a ${req.body.value} out of 5`);
  try {
    if (await updateQuery('INSERT INTO ratings(article_id, user_id, value) VALUES(?, ?, ?)',
      req.params.id, req.session.userId, req.body.value)) {
      res.status(201).json({ message: 'POST successful' });
    } else {
      res.status(400).json({ message: 'Could not POST rating' });
    }
  } catch (e) {
    console.trace('Failed to POST rating');
    res.status(400).json({ error: 'Failed to POST rating' });
  }
});

app.put('/articles/:articleId(\\d+)/ratings/:userId(\\d+)', /*authLogin, */async (req, res) => {
  // the session has number, param has string
  if (req.session.userId !== parseInt(req.params.userId)) return res.status(400).json({ error: 'Cannot change another user\'s rating' });
  if (!req.body.value) return res.status(400).json({ error: 'Insufficient data in request body' });
  console.log(`Got UPDATE request from ${req.session.user} to change rating for article ${req.params.articleId} to ${req.body.value} out of 5`);
  try {
    if (await updateQuery('UPDATE ratings SET value = ? WHERE article_id = ? AND user_id = ?',
      req.body.value, req.params.articleId, req.params.userId)) {
      res.status(201).json({ message: 'UPDATE successful' });
    } else {
      res.status(400).json({ message: 'Could not UPDATE rating' });
    }
  } catch (e) {
    console.trace('Failed to UPDATE rating');
    res.status(400).json({ error: 'Failed to UPDATE rating' });
  }
});

/* ----------------- THAT'S IT ----------------- */

app.listen(8080);

console.log(`Server started.\nUsing DB at ${conf.host}.`);
