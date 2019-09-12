TODO
----------

## Full list of REST endpoints/resources:

+ articles
    + GET ✔
    + GET front page ✔
    + GET news feed ✔
    + POST ✔
+ articles/:id
    + GET ✔
    + UPDATE?
    + DELETE?
+ articles/:id/comments
    + GET ✔
    + POST ✔
+ articles/:id/comments/:comment_id
    + GET ✔
    + UPDATE?
    + DELETE?
+ articles/:id/ratings
    + POST ✔
+ articles/:id/ratings/:id
    + GET
    + PUT ✔

+ categories/:name
    + GET ✔

+ users
    + GET ✔
    + POST ✔
+ users/:id
    + GET ✔
    + DELETE


+ login
    + POST ✔
+ logout
    + GET ✔ (?)
+ auth middleware
    + is logged in ✔ (?)
    + is author of
        + article
        + comment