// @flow

// SERVER
const express = require('express');
const path = require('path');
const session = require('express-session'); // TODO don't actually use this next time, use JWT stuffs
const bodyParser = require('body-parser');
// DB
const mysql = require('mysql2/promise');
// MISC
const fs = require('file-system');
// LOGIN
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* ----------------- GENERAL CONFIG ----------------- */

const publicPath = path.join(__dirname, '../frontend/build');
// const publicPath = path.join(__dirname, '../frontend/public');
const app = express();
app.use(express.static(publicPath));
app.use(bodyParser.json());

/* ----------------- TOKEN SETUP ----------------- */

// from express-session's thing TODO replace with JWT
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
// end of TODO replace

const TOKEN_EXPIRE_TIME = 60 * 5;
const PUBLIC_KEY = 'totally legit certificate';
const PRIVATE_KEY = PUBLIC_KEY;

/* ----------------- DATABASE CONFIG ----------------- */

const conf = JSON.parse(fs.readFileSync('database/properties.json', 'utf8'));
const pool = mysql.createPool({
  ...conf,
  connectionLimit: 9,
  waitForConnections: true,
  debug: false
});

/* ----------------- DAO INITIALIZATION ----------------- */

const ArticleDAO = require('./database/ArticleDAO');
const articleDAO = new ArticleDAO(pool);
const UserDAO = require('./database/UserDAO');
const userDAO = new UserDAO(pool);
const CommentDAO = require('./database/CommentDAO');
const commentDAO = new CommentDAO(pool);

/* ----------------- DAO METHOD WRAPPERS ----------------- */

const performSingleRowQuery = async (res: express$Response, func, context: string, ...params) => {
  func(...params)
    .then(rows => {
      if (rows) {
        return res.status(200).json(rows);
      } else {
        return res.status(404).json({ error: `GET request failed, invalid ID for ${context}` });
      }
    })
    .catch(e => {
      console.error(e, `Error occurred while fetching ${context}`);
      return res.status(404).json({ error: 'GET failed', details: e.toString() });
    });
};

const performMultiRowQuery = async (res, func: any => Promise<*[]>, context: string, ...params) => {
  console.log(`Got GET request for ${context}`);
  func(...params)
    .then(rows => {
      console.log(`${rows.length} rows found`);
      if (rows.length > 0) {
        return res.status(200).json(rows);
      } else {
        return res.status(404).json({ error: `GET request failed for ${context}${params ? ', invalid ID(s)' : ''}` });
      }
    })
    .catch(e => {
      console.error(e, `Error occurred while fetching ${context}`);
      return res.status(404).json({ error: 'GET failed', details: e.toString() });
    });
};

// wrapping regex in () after id name specifies what paths to accept
// which means /users/:id(\d+) only accepts numbers, directing /users/olegunnar to the error page
// I somehow managed to get it to accept usernames with %20 but the group needs to be (%20 w/o the last )
// see https://www.npmjs.com/package/path-to-regexp for info
// "All parameters can have a custom regexp, which overrides the default match ([^/]+)."

/* ----------------- GET ARTICLE(S) ----------------- */

app.get('/articles/:id(\\d+)', async (req, res) => {
  await performSingleRowQuery(res, articleDAO.getOne, 'one article', parseInt(req.params.id));
});

app.get('/articles', async (req, res) => {
  await performMultiRowQuery(res, articleDAO.getAll, 'all articles');
});

app.get('/articles/front_page', async (req, res) => {
  await performMultiRowQuery(res, articleDAO.getFrontPage, 'front page');
});

app.get('/articles/news_feed', async (req, res) => {
  await performMultiRowQuery(res, articleDAO.getNewsFeed, 'news feed');
});

app.get('/articles/categories', async (req, res) => {
  await performMultiRowQuery(res, articleDAO.getCategories, 'all categories');
});

app.get('/articles/categories/:name([a-z]+)', async (req, res) => {
  await performMultiRowQuery(res, articleDAO.getByCategory, `articles by category ${req.params.name}`, req.params.name);
});

/* ----------------- GET COMMENTS ----------------- */

// TODO possible special case when no comments...
// app.get('/articles/:id(\\d+)/comments', async (req, res) => {
//   await performMultiRowQuery(res, commentDAO.getOne, 'comments on article', parseInt(req.params.id));
// });

/* ----------------- GET USER(S) ----------------- */

app.get('/users/:id(\\d+)', async (req, res) => {
  await performSingleRowQuery(res, userDAO.getOne, 'one user', parseInt(req.params.id));
});

/* TODO end of mess... */

/* ----------------- SQL shortcuts - DEPRECATED ----------------- */

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

/* ----------------- LOGIN - NOW USING JWT! ----------------- */

app.post('/users', async (req, res) => {
  console.log(`Got POST request to add ${req.body.name} to users`);
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const { insertId } = await userDAO.addOne({ name: req.body.name, password: hash });
    const token = jwt.sign({ username: req.body.name }, PRIVATE_KEY, {
      expiresIn: TOKEN_EXPIRE_TIME
    });
    res.status(201).json({ message: 'POST successful', insertId: insertId, jwt: token });
  } catch (e) {
    console.trace(e, 'Error occurred during /users/');
    res.json({ error: 'Error occurred during registration', details: e.toString() });
  }
});

app.post('/login', async (req, res) => {
  if (!req.body.name || !req.body.password) return res.status(400).json({ error: 'Insufficient data in request body' });
  const { password, name } = req.body;
  console.log(`Got login request for user ${name}`);
  try {
    const user = await userDAO.getOneByName(req.body.name);
    if (await bcrypt.compare(password, user.password)) {
      console.log('Credentials OK, signing token...');
      const token = jwt.sign({ username: req.body.name }, PRIVATE_KEY, {
        expiresIn: TOKEN_EXPIRE_TIME
      });
      res.status(201).json({ message: 'Login successful', jwt: token, user_id: user.user_id });
    } else {
      console.log('Credentials WRONG');
      res.status(401).json({ error: 'Login failed, wrong credentials' });
    }
  } catch (e) {
    console.error(e, 'Error occured during login');
    res.status(401).json({ error: 'Error occured during login', details: e.toString() });
  }
});

// regen endpoint (or append to all? ...no.)
app.get('/token', (req: express$Request, res) => {
  let token = req.headers['x-access-token'];
  jwt.verify(token, PUBLIC_KEY, (err, decoded) => {
    if (err) {
      console.log('Token NOT okay');
      res.status(401).json({ error: 'Not authorized' }); // or 403...
    } else {
      console.log('Decoded token for ' + decoded.username + ', regenerating...');
      token = jwt.sign({ username: decoded.username }, PRIVATE_KEY, {
        expiresIn: TOKEN_EXPIRE_TIME
      });
      res.status(200).json({ message: 'Regenerated token', jwt: token });
    }
  });
});

const authenticate: express$Middleware<express$Request> = (
  req: express$Request,
  res: express$Response,
  next: express$NextFunction
) => {
  const token = req.headers['x-access-token'];
  jwt.verify(token, PUBLIC_KEY, (err, decoded) => {
    if (err) {
      console.log('Token NOT okay');
      res.status(401).json({ error: 'Not authorized' }); // or 403...
    } else {
      console.log(`${decoded.username} is authorized, proceeding...`);
      next();
    }
  });
};

// this turned out to not be necessary (after intense wrestling with Flow)
// auth routes
// const authenticator = express.Router();
// authenticator.post('/articles', authenticate);

// use that middleware
// app.use(authenticator);

/* ----------------- GET ROWS ----------------- */

// dis one is old TODO dao or die
const multiRowResources = [{ endpoint: '/users', query: 'SELECT user_id, name FROM users' }];

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

// TODO only delete when things are handled...
app.get('/articles/:id(\\d+)/comments', async (req, res) => {
  console.log(`Got GET request at ${req.path}`);
  try {
    const rows = await commentDAO.getByArticle(parseInt(req.params.id));
    console.log(`${rows.length} rows found`);
    // gotta send the data even if there is none, let the client handle it
    res.status(200).json(rows);
  } catch (e) {
    console.trace(e, 'Error occurred while fetching comments');
    res.status(503).send('GET request failed');
  }
});

/* ----------------- GET ONE ROW ----------------- */

app.get('/articles/:articleId/comments/:commentId', async (req, res) => {
  try {
    console.log(`Got GET request at ${req.path}`);
    const row = await commentDAO.getOne(parseInt(req.params.commentId));
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

// TODO put the auths back in when refactored & all done
app.post('/articles', authenticate, async (req, res) => {
  const { user_id, title, picture_path, picture_alt, picture_caption, content, importance, category } = req.body;
  if (!(user_id && title && content && importance && category))
    return res.status(400).json({ error: 'Insufficient data in request body' });
  // console.log(`Got POST request from ${req.session.user} to add ${title} as article`);
  console.log(`Got POST request from ${user_id} to add ${title} as article`);
  try {
    const { insertId } = await articleDAO.addOne({
      user_id,
      title,
      picture_path,
      picture_alt,
      picture_caption,
      content,
      importance,
      category
    });
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
  if (!(title && content && importance && category))
    return res.status(400).json({ error: 'Insufficient data in request body' });
  const id = parseInt(req.params.id);
  console.log(`Got PUT request to update article ${title}`);
  try {
    let fields = await articleDAO.updateOne({
      article_id: id,
      title,
      picture_path,
      picture_alt,
      picture_caption,
      content,
      importance,
      category
    });
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

app.delete('/articles/:id(\\d+)', async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Got request to DELETE article ${id}`);
  try {
    let fields = await articleDAO.deleteOne(id);
    if (fields.affectedRows === 1) {
      res.status(200).json({ message: 'DELETE successful' });
    } else {
      res.status(400).json({ message: 'Could not DELETE article' });
    }
  } catch (e) {
    console.trace(e, 'Failed to DELETE article');
    res.status(400).json({ error: 'Failed to DELETE article' });
  }
});

app.post('/articles/:id(\\d+)/comments', authenticate, async (req, res) => {
  if (!req.body.content) return res.status(400).json({ error: 'Insufficient data in request body' });
  const { content } = req.body;
  console.log(`Got POST request to add ${content} as comment to article ${req.params.id}`);
  try {
    const { insertId } = await commentDAO.addOne({ article_id: req.params.id, user_id: req.body.user_id, content });
    if (insertId > 0) {
      res.status(201).json({ message: 'POST successful' });
    } else {
      res.status(400).json({ message: 'Could not POST comment' });
    }
  } catch (e) {
    console.trace('Failed to POST comment');
    res.status(400).json({ error: 'Failed to POST comment' });
  }
});

// ratings are TODO if I get time for 'em
// will fail if used as update
app.post(
  '/articles/:id(\\d+)/ratings',
  /*authLogin, */ async (req, res) => {
    if (!req.body.value) return res.status(400).json({ error: 'Insufficient data in request body' });
    console.log(
      `Got POST request from ${req.session.user} to rate article ${req.params.id} a ${req.body.value} out of 5`
    );
    try {
      if (
        await updateQuery(
          'INSERT INTO ratings(article_id, user_id, value) VALUES(?, ?, ?)',
          req.params.id,
          req.session.userId,
          req.body.value
        )
      ) {
        res.status(201).json({ message: 'POST successful' });
      } else {
        res.status(400).json({ message: 'Could not POST rating' });
      }
    } catch (e) {
      console.trace('Failed to POST rating');
      res.status(400).json({ error: 'Failed to POST rating' });
    }
  }
);

app.put(
  '/articles/:articleId(\\d+)/ratings/:userId(\\d+)',
  /*authLogin, */ async (req, res) => {
    // the session has number, param has string
    if (req.session.userId !== parseInt(req.params.userId))
      return res.status(400).json({ error: "Cannot change another user's rating" });
    if (!req.body.value) return res.status(400).json({ error: 'Insufficient data in request body' });
    console.log(
      `Got UPDATE request from ${req.session.user} to change rating for article ${req.params.articleId} to ${req.body.value} out of 5`
    );
    try {
      if (
        await updateQuery(
          'UPDATE ratings SET value = ? WHERE article_id = ? AND user_id = ?',
          req.body.value,
          req.params.articleId,
          req.params.userId
        )
      ) {
        res.status(201).json({ message: 'UPDATE successful' });
      } else {
        res.status(400).json({ message: 'Could not UPDATE rating' });
      }
    } catch (e) {
      console.trace('Failed to UPDATE rating');
      res.status(400).json({ error: 'Failed to UPDATE rating' });
    }
  }
);

/* ----------------- THAT'S IT ----------------- */

app.listen(8080);

console.log(`Server started.\nUsing DB at ${conf.host}.`);
