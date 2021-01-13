DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS pets;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    account_created TIMESTAMP NOT NULL,
    profile_pic TEXT NOT NULL,
    profile_description TEXT NOT NULL,
    access_token TEXT NOT NULL,
    likes BIGINT
);

CREATE TABLE IF EXISTS pets (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    pet_name TEXT NOT NULL,
    type TEXT NOT NULL,
    account_created TIMESTAMP NOT NULL,
    profile_pic TEXT NOT NULL,
    profile_description TEXT NOT NULL,
    banner_pic TEXT NOT NULL
);


