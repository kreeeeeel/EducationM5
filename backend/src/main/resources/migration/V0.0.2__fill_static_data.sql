INSERT INTO task (id, title, description, type, need_count, url, reward, priority)
VALUES (1, 'Подписка на канал Telegram', 'Подпишитесь на наш канал в Telegram, чтобы начать получать новости и обновления.', 'SUBSCRIBE_TG', 1, 'https://t.me/mission1', 50, 1),
       (2, 'Модернизировать авто', 'Обновите свой автомобиль до следующего уровня.', 'UPGRADE_CAR', 1, NULL, 80, 0),
       (3, 'Пригласить 3 друзей', 'Пригласите 3 друзей и получите бонусы для всех.', 'INVITE_FRIENDS', 3, NULL, 130, 0),
       (4, 'Выполните транзакцию в TG Wallet', 'Совершите транзакцию в своем Telegram Wallet, чтобы получить бонусы и повысить свой рейтинг в игре.', 'WALLET_TRANSACTION', 1, NULL, 1000, 2),
       (5, 'Победить в 5 гонках', 'Завоюйте победу в 5 гонках, чтобы стать чемпионом.', 'RACE_VICTORIES', 5, NULL, 150, 1),
       (6, 'Победить в 7 гонках', 'Выиграйте 7 гонок, чтобы стать топ-гонщиком.', 'RACE_VICTORIES', 7, NULL, 200, 1),
       (7, 'Принять участие в 20 гонках', 'Примите участие в 20 гонках для получения уникальных бонусов.', 'NUMBER_OF_RACES', 20, NULL, 500, 1),
       (8, 'Обновить бизнес трижды', 'Трижды улучшите бизнес для максимальных доходов.', 'UPGRADE_BUSINESS', 3, NULL, 500, 1),
       (9, 'Просмотр 10 рекламных роликов', 'Посмотрите 10 рекламных роликов и получите дополнительные бонусы.', 'ADVERTISING_VIEWED', 10, NULL, 650, 1),
       (10, 'Просмотр 20 рекламных роликов', 'Посмотрите 20 рекламных роликов, чтобы получить бонусы.', 'ADVERTISING_VIEWED', 20, NULL, 300, 1),
       (11, 'Подключить TG Wallet', 'Подключите ваш Telegram Wallet к приложению, чтобы получать дополнительные бонусы и участвовать в специальных заданиях.', 'CONNECT_WALLET', 1, NULL, 300, 3);

INSERT INTO car (id, name, priority, image, required_wins, cost, car_details)
VALUES (1, 'BMW M5 E12', 1, 'https://eat_work_test.hb.ru-msk.vkcloud-storage.ru/img/e12.png', 0, 0, '{
        "upgrades": {
            "POWER": {"max": 150, "base": 100, "cost": 5},
            "BRAKING": {"max": 150, "base": 100, "cost": 5},
            "HANDLING": {"max": 150, "base": 100, "cost": 5},
            "REPUTATION": {"max": 150, "base": 100, "cost": 5}
        }
    }'),
       (2, 'BMW M5 E28', 2, 'https://eat_work_test.hb.ru-msk.vkcloud-storage.ru/img/e28.png', 5, 10000, '{
        "upgrades": {
            "POWER": {"max": 300, "base": 200, "cost": 10},
            "BRAKING": {"max": 300, "base": 200, "cost": 10},
            "HANDLING": {"max": 300, "base": 200, "cost": 10},
            "REPUTATION": {"max": 300, "base": 200, "cost": 10}
        }
    }'),
       (3, 'BMW M5 E34', 3, 'https://eat_work_test.hb.ru-msk.vkcloud-storage.ru/img/e34.png', 7, 20000, '{
        "upgrades": {
            "POWER": {"max": 450, "base": 300, "cost": 15},
            "BRAKING": {"max": 450, "base": 300, "cost": 15},
            "HANDLING": {"max": 450, "base": 300, "cost": 15},
            "REPUTATION": {"max": 450, "base": 300, "cost": 15}
        }
    }'),
       (4, 'BMW M5 E39', 4, 'https://eat_work_test.hb.ru-msk.vkcloud-storage.ru/img/e39.png', 15, 35000, '{
        "upgrades": {
            "POWER": {"max": 600, "base": 400, "cost": 20},
            "BRAKING": {"max": 600, "base": 400, "cost": 20},
            "HANDLING": {"max": 600, "base": 400, "cost": 20},
            "REPUTATION": {"max": 600, "base": 400, "cost": 20}
        }
    }'),
       (5, 'BMW M5 E60', 5, 'https://eat_work_test.hb.ru-msk.vkcloud-storage.ru/img/e60.png', 20, 50000, '{
        "upgrades": {
            "POWER": {"max": 750, "base": 500, "cost": 25},
            "BRAKING": {"max": 750, "base": 500, "cost": 25},
            "HANDLING": {"max": 750, "base": 500, "cost": 25},
            "REPUTATION": {"max": 750, "base": 500, "cost": 25}
        }
    }'),
       (6, 'BMW M5 F10', 6, 'https://eat_work_test.hb.ru-msk.vkcloud-storage.ru/img/f10.png', 25, 75000, '{
        "upgrades": {
            "POWER": {"max": 900, "base": 600, "cost": 30},
            "BRAKING": {"max": 900, "base": 600, "cost": 30},
            "HANDLING": {"max": 900, "base": 600, "cost": 30},
            "REPUTATION": {"max": 900, "base": 600, "cost": 30}
        }
    }'),
       (7, 'BMW M5 F90', 7, 'https://eat_work_test.hb.ru-msk.vkcloud-storage.ru/img/f90.png', 50, 90000, '{
        "upgrades": {
            "POWER": {"max": 950, "base": 700, "cost": 35},
            "BRAKING": {"max": 950, "base": 700, "cost": 35},
            "HANDLING": {"max": 950, "base": 700, "cost": 35},
            "REPUTATION": {"max": 950, "base": 700, "cost": 35}
        }
    }'),
       (8, 'BMW M5 G90', 8, 'https://eat_work_test.hb.ru-msk.vkcloud-storage.ru/img/g90.png', 100, 100000, '{
        "upgrades": {
            "POWER": {"max": 1000, "base": 800, "cost": 40},
            "BRAKING": {"max": 1000, "base": 800, "cost": 40},
            "HANDLING": {"max": 1000, "base": 800, "cost": 40},
            "REPUTATION": {"max": 1000, "base": 800, "cost": 40}
        }
    }');

INSERT INTO business (id, name, required_level, passive_income, upgrade_cost, image, type, max_level, description)
VALUES (1, 'АЗС', 1, 5, 100, 'https://i.ibb.co/gz9xHF0/image.png', 'CLAIM_TIME', 5, 'Время получения бензина с "Майнера" будет меньше, а доход больше.'),
       (2, 'Мастерская', 3, 3, 80, 'https://i.ibb.co/1ZNx2gW/image.png', 'CLAIM_TIME', 5, 'Улучшения автомобиля Вам будут продавать по низким ценам.'),
       (3, 'Гоночная Станция', 10, 2, 100, 'https://i.ibb.co/Fk11GxH/image.png', 'RACING_TIME', 5, 'Время обслуживания вашего авто, будет намного меньше.'),
       (4, 'Автосалон', 15, 8, 500, 'https://i.ibb.co/S0m94v7/image.png', 'REFERRAL_BONUS', 5, 'Прокачивает ваш реферальный бонус, который вы и приглашенный будете получать!');
