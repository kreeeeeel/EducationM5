create table if not exists car
(
    id            BIGSERIAL PRIMARY KEY,
    name          varchar(32),
    image         text,
    required_wins bigint,
    cost          bigint,
    priority      bigint,
    car_details   jsonb
);


create table if not exists task
(
    id          BIGSERIAL PRIMARY KEY,
    title       text,
    description text,
    type        text,
    need_count  bigint,
    url         text,
    reward      bigint,
    priority    bigint
);

create table if not exists business
(
    id             BIGSERIAL PRIMARY KEY,
    name           varchar(32),
    required_level bigint,
    passive_income bigint,
    upgrade_cost   bigint,
    image          text,
    type           text,
    max_level      bigint default 5,
    description    text
);


-- Создаем таблицу user с партиционированием по id на 100 партиций по остатку от деления
CREATE TABLE "user"
(
    id               BIGINT                   NOT NULL,
    name             VARCHAR                  NOT NULL,
    photo            VARCHAR                  NOT NULL,
    wallet_address   VARCHAR,
    level            BIGINT                   NOT NULL DEFAULT 1,
    exp              BIGINT                   NOT NULL DEFAULT 0,
    fuel             BIGINT                   NOT NULL DEFAULT 0,
    last_visited_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL,
    next_claim_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    referral_bonus   BIGINT                   NOT NULL DEFAULT 0,
    daily_last_claim DATE,
    daily_entry      BIGINT                   NOT NULL DEFAULT 0,
    inviter_id       BIGINT,
    PRIMARY KEY (id),
    FOREIGN KEY (inviter_id) REFERENCES "user" (id)
) PARTITION BY HASH (id);

-- Создаем 100 партиций для таблицы user
DO
$$
    BEGIN
        FOR i IN 0..99
            LOOP
                EXECUTE format('
            CREATE TABLE user_partition_%s PARTITION OF "user"
            FOR VALUES WITH (MODULUS 100, REMAINDER %s);', i, i);
            END LOOP;
    END
$$;

-- Создаем таблицу user_rating с индексом btree на столбец rating
CREATE TABLE user_rating
(
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT                   NOT NULL UNIQUE,
    rating       BIGINT                   NOT NULL,
    win_count    BIGINT                   NOT NULL DEFAULT 0,
    racing_count BIGINT                   NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user" (id)
);

-- Создаем индекс на столбец rating
CREATE INDEX idx_user_rating_rating ON user_rating USING btree (rating);

-- Создаем таблицу user_referral
CREATE TABLE user_referral
(
    id               BIGSERIAL PRIMARY KEY,
    referrer_id      BIGINT NOT NULL,
    referred_user_id BIGINT NOT NULL,
    bonus            BIGINT NOT NULL,
    FOREIGN KEY (referrer_id) REFERENCES "user" (id),
    FOREIGN KEY (referred_user_id) REFERENCES "user" (id)
);

-- Создаем таблицу user_task
-- Предполагается, что таблица task уже существует
CREATE TYPE user_task_status AS ENUM ('NotStarted', 'Failed', 'Success', 'CheckInProgress');

CREATE TABLE user_task
(
    id      BIGSERIAL PRIMARY KEY,
    user_id BIGINT           NOT NULL,
    task_id BIGINT           NOT NULL,
    status  user_task_status NOT NULL,
    details JSONB,
    FOREIGN KEY (user_id) REFERENCES "user" (id),
    FOREIGN KEY (task_id) REFERENCES task (id)
);

-- Создаем таблицу user_business
-- Предполагается, что таблица business уже существует
CREATE TABLE user_business
(
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT NOT NULL,
    business_id    BIGINT NOT NULL,
    level          BIGINT NOT NULL DEFAULT 1,
    passive_income BIGINT NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES "user" (id),
    FOREIGN KEY (business_id) REFERENCES business (id)
);


-- Создаем таблицу user_car
-- Предполагается, что таблица car уже существует
CREATE TABLE user_car
(
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT                   NOT NULL,
    car_id         BIGINT                   NOT NULL,
    power          BIGINT                   NOT NULL DEFAULT 0,
    handling       BIGINT                   NOT NULL DEFAULT 0,
    braking        BIGINT                   NOT NULL DEFAULT 0,
    reputation     BIGINT                   NOT NULL DEFAULT 0,
    next_racing_at TIMESTAMP WITH TIME ZONE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user" (id),
    FOREIGN KEY (car_id) REFERENCES car (id)
);


