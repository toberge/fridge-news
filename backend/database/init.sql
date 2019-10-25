DROP TABLE IF EXISTS articles, users, ratings, comments;

CREATE TABLE articles(
    article_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    title VARCHAR(64) NOT NULL,
    media VARCHAR(2083),
    content TEXT NOT NULL,
    upload_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
    importance TINYINT NOT NULL DEFAULT 2,
    category ENUM('news', 'culture', 'science', 'politics', 'bad stuff') NOT NULL,
    INDEX article_title_time(title, upload_time),
    INDEX article_importance_time(importance, upload_time),
    INDEX article_category_time(upload_time, importance, category)
) DEFAULT CHAR SET utf8 DEFAULT COLLATE utf8_general_ci;

CREATE TABLE users(
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) /*NOT NULL*/,
    admin BOOLEAN NOT NULL DEFAULT 0,
    INDEX user_name(name)
) DEFAULT CHAR SET utf8 DEFAULT COLLATE utf8_general_ci;

CREATE TABLE ratings(
    article_id INT NOT NULL REFERENCES articles(article_id),
    user_id INT NOT NULL REFERENCES users(user_id),
    value INT NOT NULL,
    CONSTRAINT PRIMARY KEY comment_pk(article_id, user_id)
);

CREATE TABLE comments(
    comment_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    article_id INT NOT NULL REFERENCES articles(article_id),
    user_id INT NOT NULL REFERENCES users(user_id),
    title VARCHAR(30) NOT NULL,
    content TEXT NOT NULL,
    upload_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
    INDEX comment_article_index(article_id),
    INDEX comment_user_index(user_id),
    INDEX comment_article_time_index(article_id, upload_time),
    INDEX comment_article_time_title_index(article_id, upload_time, title)
) DEFAULT CHAR SET utf8 DEFAULT COLLATE utf8_general_ci;


DROP VIEW IF EXISTS articles_view, front_page, news_feed;

CREATE VIEW articles_view AS(
    SELECT articles.*,
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
