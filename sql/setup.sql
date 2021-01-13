DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    account_created TIMESTAMP NOT NULL,
    subscriptions BIGINT REFERENCES users_pets(id)[],
    pet BIGINT REFERENCES pets(id)[],
    profile_pic TEXT NOT NULL,
    profile_description TEXT NOT NULL,
    access_token TEXT NOT NULL,
    likes BIGINT
);