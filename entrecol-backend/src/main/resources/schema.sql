DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `book`;
DROP TABLE IF EXISTS `author`;
DROP TABLE IF EXISTS `language`;
DROP TABLE IF EXISTS `publisher`;
DROP TABLE IF EXISTS `rating`;
DROP TABLE IF EXISTS `book_author`;

CREATE TABLE `user` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE `language` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE `publisher` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE `author` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE `book` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    original_id BIGINT UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    language_id BIGINT,
    num_pages INT,
    average_rating DECIMAL(3,2),
    isbn VARCHAR(20),
    isbn13 VARCHAR(20),
    publisher_id BIGINT,
    publication_date DATE,
    FOREIGN KEY (language_id) REFERENCES language(id),
    FOREIGN KEY (publisher_id) REFERENCES publisher(id)
);

CREATE TABLE `rating` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT NOT NULL,
    ratings_count INT NOT NULL,
    text_reviews_count INT NOT NULL,
    FOREIGN KEY (book_id) REFERENCES book(id)
);

CREATE TABLE `book_author` (
    book_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES book(id),
    FOREIGN KEY (author_id) REFERENCES author(id)
);
