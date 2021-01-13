DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS pets CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS comments;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    account_created TIMESTAMP NOT NULL,
    profile_picture TEXT NOT NULL,
    profile_description TEXT NOT NULL,
    likes BIGINT
);

CREATE TABLE pets (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    pet_name TEXT NOT NULL,
    type TEXT NOT NULL,
    account_created TIMESTAMP NOT NULL,
    profile_picture TEXT NOT NULL,
    profile_description TEXT NOT NULL,
    banner_picture TEXT NOT NULL
);

CREATE TABLE subscriptions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pet_id BIGINT REFERENCES pets(id),
    user_id BIGINT REFERENCES users(id)
);

CREATE TABLE posts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pet_id BIGINT REFERENCES pets(id),
    post_time TIMESTAMP NOT NULL,
    picture_url TEXT,
    video_url TEXT,
    post_text TEXT,
    likes BIGINT
);

CREATE TABLE comments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    post_id BIGINT REFERENCES post(id),
    text TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL
);