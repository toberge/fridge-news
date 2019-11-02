DROP TABLE IF EXISTS articles, users, ratings, comments;

CREATE TABLE articles(
    article_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL REFERENCES users(user_id),
    title VARCHAR(32) NOT NULL,
    picture_path VARCHAR(2083),
    picture_alt VARCHAR(64),
    picture_caption VARCHAR(64),
    content TEXT NOT NULL,
    upload_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
    importance TINYINT NOT NULL DEFAULT 2,
    category ENUM('news', 'culture', 'science', 'politics') NOT NULL,
    INDEX article_title_time(title, upload_time),
    INDEX article_importance_time(importance, upload_time),
    INDEX article_category_time(upload_time, importance, category)
) DEFAULT CHAR SET utf8 DEFAULT COLLATE utf8_general_ci;

CREATE TABLE users(
    user_id INT PRIMARY KEY AUTO_INCREMENT ,
    name VARCHAR(32) UNIQUE NOT NULL,
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
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
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


DROP VIEW IF EXISTS articles_view, articles_condensed, front_page, news_feed;

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

CREATE VIEW articles_condensed AS(
    SELECT article_id,
           title,
           picture_path,
           picture_alt,
           category
    FROM articles_view
    ORDER BY upload_time DESC,
             importance ASC,
             rating DESC
);

CREATE VIEW front_page AS(
    SELECT article_id,
           title,
           picture_path,
           picture_alt,
           category
    FROM articles_view
    WHERE importance = 1
    ORDER BY upload_time DESC,
             rating DESC
);

CREATE VIEW news_feed AS(
    SELECT article_id,
           title,
           picture_path,
           picture_alt,
           upload_time
    FROM articles
    ORDER BY upload_time DESC,
             importance ASC
    LIMIT 20
);
