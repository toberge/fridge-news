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
    + DELETE
+ articles/:id/comments
    + GET
    + POST
+ articles/:id/comments/:user_id
    + GET
    + UPDATE?
    + DELETE
+ articles/:id/ratings
    + POST


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