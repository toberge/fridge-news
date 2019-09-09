DROP TABLE IF EXISTS articles, users, ratings, comments;

CREATE TABLE articles(
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    title VARCHAR(40) NOT NULL,
    media VARCHAR(2083),
    content TEXT NOT NULL,
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
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

DROP VIEW IF EXISTS articles_view, front_page, news_feed;

CREATE VIEW articles_view AS(
    SELECT articles.article_id,
           articles.user_id,
           title,
           media,
           content,
           upload_time,
           update_time,
           importance,
           category,
           IF(AVG(ratings.value) IS NOT NULL,
              AVG(ratings.value), /*ELSE*/ 4) AS rating
    FROM articles LEFT JOIN ratings
                         ON(articles.article_id = ratings.article_id)
    GROUP BY articles.article_id
    ORDER BY upload_time DESC,
             importance ASC,
             rating DESC
);

CREATE VIEW front_page AS(
    SELECT * FROM articles_view
    WHERE importance = 1
    ORDER BY upload_time DESC,
             rating DESC
);

CREATE VIEW news_feed AS(
    SELECT article_id,
           title,
           media,
           upload_time,
           importance
    FROM articles
    ORDER BY upload_time DESC,
             importance ASC
    LIMIT 20
);

CREATE TABLE comments(
    article_id INT REFERENCES articles(article_id),
    user_id INT REFERENCES users(user_id),
    title VARCHAR(30),
    content TEXT,
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT PRIMARY KEY comment_pk(article_id, user_id, upload_time)
) DEFAULT CHAR SET utf8 DEFAULT COLLATE utf8_general_ci;

INSERT INTO articles(user_id, title, media, content, importance, category) VALUES
                    (1, 'Title', NULL, 'Text is very <em>italic</em>', 1, 'død'),
                    (1, 'Lorem ipsum', NULL, 'Lorem ipsum dolor sit amet', 2, 'innenriks'),
                    (1, 'Emptiness Intrudes', NULL, 'The fridge is empty and no more news will be served', 1, 'død');

INSERT INTO users(name) VALUES
            ('Admin'),
            ('Thonk Face'),
            ('Alfred Barskknaus'),
            ('Donaldo Ducke');

INSERT INTO ratings(article_id, user_id, value) VALUES
                      (1,         1,       2),
                      (1,         2,       3),
                      (1,         3,       5);
