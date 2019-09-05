DROP TABLE IF EXISTS articles, users, ratings, comments;

CREATE TABLE articles(
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    media VARCHAR(2083),
    content TEXT NOT NULL,
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    importance INT NOT NULL DEFAULT 1,
    category ENUM('innenriks', 'utenriks', 'død') NOT NULL,
    /*CONSTRAINT PRIMARY KEY article_pk(upload_time, title),*/
    INDEX article_title_time(title, upload_time),
    INDEX article_importance_time(importance, upload_time)
) DEFAULT CHAR SET utf8 DEFAULT COLLATE utf8_general_ci;

CREATE TABLE users(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) /*NOT NULL*/,
    INDEX user_name(name)
) DEFAULT CHAR SET utf8 DEFAULT COLLATE utf8_general_ci;

CREATE TABLE ratings(
    article_id INT REFERENCES articles(article_id),
    user_id INT REFERENCES users(user_id),
    value INT,
    CONSTRAINT PRIMARY KEY comment_pk(article_id, user_id)
);

DROP VIEW IF EXISTS articles_view;

CREATE VIEW articles_view AS(
    SELECT articles.article_id,
           title,
           media,
           content,
           upload_time,
           importance,
           category,
           AVG(ratings.value) AS rating
    FROM articles, ratings
    WHERE articles.article_id = ratings.article_id
      AND articles.importance = 1
    GROUP BY articles.article_id
    ORDER BY upload_time DESC
);

CREATE TABLE comments(
    article_id INT REFERENCES articles(article_id),
    user_id INT REFERENCES users(user_id),
    title VARCHAR(30),
    content TEXT,
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT PRIMARY KEY comment_pk(article_id, user_id)
) DEFAULT CHAR SET utf8 DEFAULT COLLATE utf8_general_ci;

INSERT INTO articles(title, media, content, importance, category) VALUES
                    ('Title', NULL, 'Text is very <em>italic</em>', 1, 'død');
INSERT INTO users(name) VALUES
            ('Thonk Face'),
            ('Alfred Barskknaus'),
            ('Donaldo Ducke');
INSERT INTO ratings(article_id, user_id, value) VALUES
                      (1,         1,       2),
                      (1,         2,       3),
                      (1,         3,       5);