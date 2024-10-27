INSERT INTO `user` (username, password, email) VALUES
('usuario1', '$2a$10$0hxNcNcGj9Jgd9AfyBRVwOPeQeeLCVn16UouBctICB.aWpxMJkDT2', 'usuario1@entrecol.com'),
('usuario2', '$2a$10$0hxNcNcGj9Jgd9AfyBRVwOPeQeeLCVn16UouBctICB.aWpxMJkDT2', 'usuario2@entrecol.com'),
('usuario3', '$2a$10$0hxNcNcGj9Jgd9AfyBRVwOPeQeeLCVn16UouBctICB.aWpxMJkDT2', 'usuario3@entrecol.com');

-- -- Insert languages
-- INSERT INTO `language` (code) VALUES
-- ('eng'),
-- ('spa'),
-- ('fre'),
-- ('ger'),
-- ('por'),
-- ('en-US'),
-- ('en-GB'),
-- ('mul');

-- -- Insert publishers
-- INSERT INTO `publisher` (name) VALUES
-- ('Scholastic Inc.'),
-- ('Penguin Books'),
-- ('Del Rey'),
-- ('Crown'),
-- ('Random House Audio'),
-- ('Wings Books'),
-- ('Broadway Books'),
-- ('Harper Perennial'),
-- ('Vintage'),
-- ('Ballantine Books'),
-- ('Houghton Mifflin Harcourt'),
-- ('Gramercy Books'),
-- ('Tor Books'),
-- ('Spectra'),
-- ('Bantam Books');

-- -- Insert authors
-- INSERT INTO `author` (name) VALUES
-- ('J.K. Rowling'),
-- ('Mary GrandPré'),
-- ('Douglas Adams'),
-- ('Bill Bryson'),
-- ('Thomas Pynchon'),
-- ('Neal Stephenson'),
-- ('William T. Vollmann'),
-- ('Haruki Murakami'),
-- ('Philip Pullman'),
-- ('C.S. Lewis'),
-- ('J.R.R. Tolkien'),
-- ('Peter F. Hamilton'),
-- ('Stephen King'),
-- ('George R.R. Martin'),
-- ('Terry Pratchett');

-- -- Insert books
-- INSERT INTO `book` (original_id, title, language_id, num_pages, average_rating, isbn, isbn13, publisher_id, publication_date) VALUES
-- (1, 'Harry Potter and the Half-Blood Prince', 1, 652, 4.57, '0439785960', '9780439785969', 1, '2006-09-16'),
-- (2, 'Harry Potter and the Order of the Phoenix', 1, 870, 4.49, '0439358078', '9780439358071', 1, '2004-09-01'),
-- (12, 'The Ultimate Hitchhiker''s Guide', 1, 815, 4.38, '0517226952', '9780517226957', 6, '2005-11-01'),
-- (21, 'A Short History of Nearly Everything', 1, 544, 4.21, '076790818X', '9780767908184', 7, '2004-09-14'),
-- (816, 'Cryptonomicon', 1, 1139, 4.25, '0060512806', '9780060512804', 8, '2002-11-01');

-- -- Insert book_author relationships
-- INSERT INTO `book_author` (book_id, author_id) VALUES
-- (1, 1), -- Harry Potter - J.K. Rowling
-- (1, 2), -- Harry Potter - Mary GrandPré
-- (2, 1), -- Order of the Phoenix - J.K. Rowling
-- (2, 2), -- Order of the Phoenix - Mary GrandPré
-- (3, 3), -- Hitchhiker's Guide - Douglas Adams
-- (4, 4), -- Short History - Bill Bryson
-- (5, 6); -- Cryptonomicon - Neal Stephenson

-- -- Insert ratings
-- INSERT INTO `rating` (book_id, ratings_count, text_reviews_count) VALUES
-- (1, 2095690, 27591), -- Half-Blood Prince
-- (2, 2153167, 29221), -- Order of the Phoenix
-- (3, 3628, 254),      -- Hitchhiker's Guide
-- (4, 248558, 9396),   -- Short History
-- (5, 83184, 4249);    -- Cryptonomicon
