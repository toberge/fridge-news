// @flow

// SERVER
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// DB
const mysql = require('mysql2/promise');
// MISC
const fs = require('file-system');
// LOGIN
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

type Response = express$Response;
type Request = express$Request;

/* ----------------- GENERAL CONFIG ----------------- */

const publicPath = path.join(__dirname, '../frontend/build');
// const publicPath = path.join(__dirname, '../frontend/public');
const app = express();
app.use(express.static(publicPath));
app.use(bodyParser.json());

/* ----------------- TOKEN SETUP ----------------- */

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

const performSingleRowQuery = async (res: Response, func: any => Promise<{}>, context: string, ...params) => {
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

const performMultiRowQuery = async (res: Response, func: any => Promise<*[]>, context: string, ...params) => {
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

app.get('/articles/:id(\\d+)', async (req: Request, res: Response) => {
  await performSingleRowQuery(res, articleDAO.getOne, 'one article', parseInt(req.params.id));
});

app.get('/articles', async (req: Request, res: Response) => {
  await performMultiRowQuery(res, articleDAO.getAll, 'all articles');
});

app.get('/articles/front_page', async (req: Request, res: Response) => {
  await performMultiRowQuery(res, articleDAO.getFrontPage, 'front page');
});

app.get('/articles/news_feed', async (req: Request, res: Response) => {
  await performMultiRowQuery(res, articleDAO.getNewsFeed, 'news feed');
});

app.get('/articles/categories', async (req: Request, res: Response) => {
  await performMultiRowQuery(res, articleDAO.getCategories, 'all categories');
});

app.get('/articles/categories/:name([a-z]+)', async (req: Request, res: Response) => {
  await performMultiRowQuery(res, articleDAO.getByCategory, `articles by category ${req.params.name}`, req.params.name);
});

/* ----------------- GET COMMENTS ----------------- */

// TODO possible special case when no comments...
// app.get('/articles/:id(\\d+)/comments', async (req: Request, res: Response) => {
//   await performMultiRowQuery(res, commentDAO.getOne, 'comments on article', parseInt(req.params.id));
// });

/* ----------------- GET USER(S) ----------------- */

app.get('/users/', async (req: Request, res: Response) => {
  await performMultiRowQuery(res, userDAO.getAll, 'all users');
});

app.get('/users/:id(\\d+)', async (req: Request, res: Response) => {
  await performSingleRowQuery(res, userDAO.getOne, 'one user', parseInt(req.params.id));
});

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

app.post('/users', async (req: Request, res: Response) => {
  if (!(req.body && req.body.name && req.body.password)) return res.status(400).json({ error: 'Insufficient data in request body' });
  const { name, password } = req.body;
  if (!(typeof name === 'string' && typeof password === 'string')) return res.status(400).json({ error: 'Invalid types of request data' });

  console.log(`Got POST request to add ${name} to users`);
  try {
    const hash = await bcrypt.hash(password, 10);
    const { insertId } = await userDAO.addOne({ name: name, password: hash });
    const token = jwt.sign({ username: name }, PRIVATE_KEY, {
      expiresIn: TOKEN_EXPIRE_TIME
    });
    return res.status(201).json({ message: 'POST successful', insertId: insertId, jwt: token });
  } catch (e) {
    console.trace(e, 'Error occurred during /users/');
    // assuming it's due to already present username
    return res.status(403).json({ error: 'Error occurred during registration', details: e.toString() });
  }
});

app.post('/login', async (req: Request, res: Response) => {
  if (!(typeof req.body === 'object') || !req.body) return;
  if (!req.body.name || !req.body.password) return res.status(400).json({ error: 'Insufficient data in request body' });
  const { password, name } = req.body;
  if (!(typeof name === 'string' && typeof password === 'string')) return res.status(400).json({ error: 'Invalid types of request data' });
  console.log(`Got login request for user ${name}`);
  try {
    const user = await userDAO.getOneByName(name);
    if (await bcrypt.compare(password, user.password)) {
      console.log('Credentials OK, signing token...');
      const token = jwt.sign({ username: name }, PRIVATE_KEY, {
        expiresIn: TOKEN_EXPIRE_TIME
      });
      return res.status(201).json({ message: 'Login successful', jwt: token, user_id: user.user_id });
    } else {
      console.log('Credentials WRONG');
      return res.status(401).json({ error: 'Login failed, wrong credentials' });
    }
  } catch (e) {
    console.error(e, 'Error occured during login');
    return res.status(401).json({ error: 'Error occured during login', details: e.toString() });
  }
});

// regen endpoint (or append to all? ...no.)
app.get('/token', (req: Request, res: Response) => {
  let token = req.headers['x-access-token'];
  jwt.verify(token, PUBLIC_KEY, (err, decoded) => {
    if (err) {
      console.log('Token NOT okay');
      return res.status(401).json({ error: 'Not authorized' }); // or 403...
    } else {
      console.log('Decoded token for ' + decoded.username + ', regenerating...');
      token = jwt.sign({ username: decoded.username }, PRIVATE_KEY, {
        expiresIn: TOKEN_EXPIRE_TIME
      });
      return res.status(200).json({ message: 'Regenerated token', jwt: token });
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
      return res.status(401).json({ error: 'Not authorized' }); // or 403...
    } else {
      console.log(`${decoded.username} is authorized, proceeding...`);
      return next();
    }
  });
};

const checkIfOwnerOfArticle: express$Middleware<express$Request> = async (
  req: express$Request,
  res: express$Response,
  next: express$NextFunction
) => {
  const token = req.headers['x-access-token'];
  jwt.verify(token, PUBLIC_KEY, async (err, decoded) => {
    if (err) {
      console.log('Token NOT okay');
      return res.status(401).json({ error: 'Not authorized' });
    } else {
      try {
        const user = await userDAO.getOneByName(decoded.username);
        const article = await articleDAO.getOne(parseInt(req.params.id));
        if (user.user_id === article.user_id) {
          console.log(`${decoded.username} is author of the article, proceeding...`);
          return next();
        } else {
          return res.status(401).json({ error: 'Not authorized' });
        }
      } catch (e) {
        return res.status(500).json({ error: 'Not authorized' });
      }
    }
  });
};

/* ----------------- GET ROWS ----------------- */

// TODO only delete when things are handled...
app.get('/articles/:id(\\d+)/comments', async (req: Request, res: Response) => {
  console.log(`Got GET request at ${req.path}`);
  try {
    const rows = await commentDAO.getByArticle(parseInt(req.params.id));
    console.log(`${rows.length} rows found`);
    // gotta send the data even if there is none, let the client handle it
    return res.status(200).json(rows);
  } catch (e) {
    console.trace(e, 'Error occurred while fetching comments');
    return res.status(503).send('GET request failed');
  }
});

/* ----------------- POST REQUESTS ----------------- */

app.post('/articles', authenticate, async (req: Request, res: Response) => {
  if (!(req.body && req.body.user_id && req.body.title && req.body.content && req.body.importance && req.body.category))
    return res.status(400).json({ error: 'Insufficient data in request body' });
  const { user_id, title, content, importance, category } = req.body;
  if (!(typeof title === 'string' && typeof user_id === 'number' && typeof content === 'string' && typeof importance === 'number' && typeof category === 'string'))
    return res.status(400).json({ error: 'Invalid types of request data' });

  console.log(`Got POST request from ${user_id} to add ${title} as article`);
  try {
    const { insertId } = await articleDAO.addOne({
      user_id,
      title,
      picture_path: req.body && req.body.picture_path && typeof req.body.picture_path === 'string' ? req.body.picture_path : null,
      picture_alt: req.body && req.body.picture_alt && typeof req.body.picture_alt === 'string' ? req.body.picture_alt : null,
      picture_caption: req.body && req.body.picture_caption && typeof req.body.picture_caption === 'string' ? req.body.picture_caption : null,
      content,
      importance,
      category
    });
    if (insertId > 0) {
      return res.status(201).json({ message: 'POST successful', id: insertId });
    } else {
      return res.status(400).json({ message: 'Could not POST article' });
    }
  } catch (e) {
    console.trace(e, 'Failed to POST article');
    return res.status(400).json({ error: 'Failed to POST article' });
  }
});

app.put('/articles/:id(\\d+)', checkIfOwnerOfArticle, async (req: Request, res: Response) => {
  if (!(req.body && req.body.title && req.body.content && req.body.importance && req.body.category))
    return res.status(400).json({ error: 'Insufficient data in request body' });
  const { title, content, importance, category } = req.body;
  if (!(typeof title === 'string' && typeof content === 'string' && typeof importance === 'number' && typeof category === 'string'))
    return res.status(400).json({ error: 'Invalid types of request data' });

  console.log(`Got PUT request to update article ${title}`);
  try {
    let fields = await articleDAO.updateOne({
      article_id: parseInt(req.params.id),
      title,
      picture_path: req.body && req.body.picture_path && typeof req.body.picture_path === 'string' ? req.body.picture_path : null,
      picture_alt: req.body && req.body.picture_alt && typeof req.body.picture_alt === 'string' ? req.body.picture_alt : null,
      picture_caption: req.body && req.body.picture_caption && typeof req.body.picture_caption === 'string' ? req.body.picture_caption : null,
      content,
      importance,
      category
    });
    if (fields.affectedRows === 1) {
      return res.status(200).json({ message: 'PUT successful' });
    } else {
      return res.status(400).json({ message: 'Could not PUT article' });
    }
  } catch (e) {
    console.trace(e, 'Failed to PUT article');
    return res.status(400).json({ error: 'Failed to PUT article' });
  }
});

app.delete('/articles/:id(\\d+)', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  console.log(`Got request to DELETE article ${id}`);
  try {
    let fields = await articleDAO.deleteOne(id);
    if (fields.affectedRows === 1) {
      return res.status(200).json({ message: 'DELETE successful' });
    } else {
      return res.status(400).json({ message: 'Could not DELETE article' });
    }
  } catch (e) {
    console.trace(e, 'Failed to DELETE article');
    return res.status(400).json({ error: 'Failed to DELETE article' });
  }
});

app.post('/articles/:id(\\d+)/comments', authenticate, async (req: Request, res: Response) => {
  if (!(req.body && req.body.content && req.body.user_id))
    return res.status(400).json({ error: 'Insufficient data in request body' });
  const { content, user_id } = req.body;
  if (!(typeof content === 'string' && typeof user_id === 'number'))
    return res.status(400).json({ error: 'Wrong type(s) of data' });
  console.log(`Got POST request to add ${content} as comment to article ${req.params.id}`);
  try {
    const { insertId } = await commentDAO.addOne({ article_id: parseInt(req.params.id), user_id: user_id, content });
    if (insertId > 0) {
      return res.status(201).json({ message: 'POST successful' });
    } else {
      return res.status(400).json({ message: 'Could not POST comment' });
    }
  } catch (e) {
    console.trace('Failed to POST comment');
    return res.status(400).json({ error: 'Failed to POST comment' });
  }
});

// ratings are TODO if I get time for 'em
// will fail if used as update
/*app.post(
  '/articles/:id(\\d+)/ratings',
  /!*authLogin, *!/ async (req: Request, res: Response) => {
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
  /!*authLogin, *!/ async (req: Request, res: Response) => {
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
);*/

/* ----------------- THAT'S IT ----------------- */

app.listen(8080);

console.log(`Server started.\nUsing DB at ${conf.host}.`);
