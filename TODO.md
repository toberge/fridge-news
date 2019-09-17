TODO
----------

## Full list of REST endpoints/resources:

+ articles
    + GET ✔
    + POST ✔
+ articles/front_page
    + GET ✔
+ articles/news_feed
    + GET ✔
+ articles/categories/:name
    + GET ✔
+ articles/:id
    + GET ✔
    + PUT?
    + DELETE?
+ articles/:id/comments
    + GET ✔
    + POST ✔
+ articles/:id/comments/:comment_id
    + GET ✔
    + PUT
    + DELETE
+ articles/:id/ratings
    + POST ✔
+ articles/:id/ratings/:id
    + GET
    + PUT ✔
    + DELETE

+ users
    + GET ✔
    + POST ✔
+ users/:id
    + GET ✔
    + DELETE

+ login
    + POST ✔
+ logout
    + POST ✔
+ auth middleware
    + is logged in ✔ (?)
    + is author of
        + article
        + comment

## Other tasks

+ session cookie --> token for authentication
+ split DB queries into DAOs
+ actually write tests
+ frontend at a later point