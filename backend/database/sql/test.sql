INSERT INTO articles(user_id, title, picture_path, picture_alt, picture_caption, content, upload_time, importance, category) VALUES
(3, 'One Thousand Teslas Found Outside the Solar System', NULL, NULL, NULL,
 'elon r u ok',
 '2019-05-24 13:37:00', 2, 'science'),
(1, 'Fridge Found Floating in Space', 'https://i.imgur.com/puQs66y.png', 'A fridge', 'The infamous space-floating fridge',
 'After its long flight through the rings of Saturn, a fridge of mysterious origin was caught by a spacewalking astronaut on the ISS and brought to Earth for inspection. Inside were the remains of an unknown biological life form - and a pile of ancient floppy disks. The floppies contained impressive amounts of text - newspaper articles, essays, even a few poems. This material is what we will publish on this website. Feel free to publish whatever else you want to fill this place with, dear users. ',
 '2019-03-01 11:03:15', 1, 'news'),
(1, 'Space Cows Demand We Go Vegan', NULL, NULL, NULL,
 'Yesterday, a fleet of extrasolar ships approached Earth, bearing an ultimatum. If we do not stop eating meat and return all our livestock to nature, our entire civilization will be eradicated. The species behind this harsh request look almost exactly like the cows of humanity''s home world, but their intelligence is on a whole other level, perhaps exceeding ours. Most governments in the solar system have already stated that they perceive this threat as very real, some adding that they will take immediate action to enforce a meat ban.',
 '1997-07-14 20:10:01', 1, 'news');

INSERT INTO users(name) VALUES
('The Fridge'),
('Nostradamus'),
('Colonel Sanders');

INSERT INTO ratings(article_id, user_id, value) VALUES
(1,         1,       2),
(1,         2,       3),
(1,         3,       5);

INSERT INTO comments(article_id, user_id, content) VALUES
(1, 1, 'Some text'),
(1, 2, 'What is this mess'),
(2, 3, 'It\'s all way too bad');
