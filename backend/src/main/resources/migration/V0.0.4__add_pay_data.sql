create table if not exists trade_stars
(
    id       bigint,
    price    integer,
    exchange bigint
);

INSERT INTO trade_stars (id, exchange, price) VALUES
        (1, 100, 1),
        (2, 250, 5),
        (3, 750, 15),
        (4, 1500, 20),
        (5, 3000, 25),
        (6, 5000, 35),
        (7, 7500, 50);
