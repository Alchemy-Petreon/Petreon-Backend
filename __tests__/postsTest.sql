INSERT INTO users (user_name, first_name, email, account_created, profile_picture, profile_description, likes) VALUES 
('catdog', 'john', 'smith', '01-01-2021 00:01:00', 'stuff.jpg', 'its a catdog', 0);

INSERT INTO pets (user_id, pet_name, type, account_created, profile_picture, profile_description, banner_picture) VALUES ('1', 'gilgamesh', 'cat', '01-01-2021 00:01:00', 'gil.jpg', 'demon cat', 'gil2.jpg');

INSERT INTO pets (user_id, pet_name, type, account_created, profile_picture, profile_description, banner_picture) VALUES ('1', 'mumu', 'exotic', '01-01-2021 00:01:00', 'mumu.jpg', 'demon gorilla', 'mumu2.jpg');

INSERT INTO posts (pet_id, post_time, picture_url, video_url, post_text, likes) VALUES ('2', '01-01-2021 00:01:00', 'mumucute.png', null, 'mumu so cute', 0);

INSERT INTO posts (pet_id, post_time, picture_url, video_url, post_text, likes) VALUES ('2', '01-01-2021 00:01:00', null, 'mumubad.avi', 'mumu so bad', 0);