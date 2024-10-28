DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `book`;
DROP TABLE IF EXISTS `author`;
DROP TABLE IF EXISTS `language`;
DROP TABLE IF EXISTS `publisher`;
DROP TABLE IF EXISTS `rating`;
DROP TABLE IF EXISTS `book_author`;
DROP TABLE IF EXISTS `employee`;
DROP TABLE IF EXISTS `department`;
DROP TABLE IF EXISTS `position`;
DROP TABLE IF EXISTS `eps`;
DROP TABLE IF EXISTS `arl`;
DROP TABLE IF EXISTS `pension_fund`;
DROP TABLE IF EXISTS `employee_record`;

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
    FOREIGN KEY (language_id) REFERENCES `language`(id),
    FOREIGN KEY (publisher_id) REFERENCES `publisher`(id)
);

CREATE TABLE `rating` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT NOT NULL,
    ratings_count INT NOT NULL,
    text_reviews_count INT NOT NULL,
    FOREIGN KEY (book_id) REFERENCES `book`(id)
);

CREATE TABLE `book_author` (
    book_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES `book`(id),
    FOREIGN KEY (author_id) REFERENCES `author`(id)
);

CREATE TABLE `department` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE `position` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE `eps` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE `arl` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE `pension_fund` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE `employee` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    department_id BIGINT NOT NULL,
    position_id BIGINT NOT NULL,
    hire_date DATE NOT NULL,
    eps_id BIGINT NOT NULL,
    arl_id BIGINT NOT NULL,
    pension_fund_id BIGINT NOT NULL,
    salary DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (department_id) REFERENCES `department`(id),
    FOREIGN KEY (position_id) REFERENCES `position`(id),
    FOREIGN KEY (eps_id) REFERENCES `eps`(id),
    FOREIGN KEY (arl_id) REFERENCES `arl`(id),
    FOREIGN KEY (pension_fund_id) REFERENCES `pension_fund`(id)
);

CREATE TABLE `employee_record` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    disability_record BOOLEAN DEFAULT FALSE,
    vacation_record BOOLEAN DEFAULT FALSE,
    worked_days INT NOT NULL,
    disability_days INT DEFAULT 0,
    vacation_days INT DEFAULT 0,
    vacation_start_date DATE,
    vacation_end_date DATE,
    disability_start_date DATE,
    disability_end_date DATE,
    bonus DECIMAL(12,2) DEFAULT 0,
    transport_allowance DECIMAL(12,2) DEFAULT 0,
    record_date DATE NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES `employee`(id)
);

CREATE INDEX idx_employee_code ON `employee`(code);
CREATE INDEX idx_employee_record_date ON `employee_record`(record_date);
CREATE INDEX idx_employee_record_employee ON `employee_record`(employee_id);

CREATE TABLE `movie` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    original_id BIGINT UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    release_year INT NOT NULL
);

CREATE TABLE `genre` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE `movie_genre` (
    movie_id BIGINT NOT NULL,
    genre_id BIGINT NOT NULL,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES `movie`(id),
    FOREIGN KEY (genre_id) REFERENCES `genre`(id)
);

CREATE INDEX idx_movie_original_id ON `movie`(original_id);
CREATE INDEX idx_movie_year ON `movie`(release_year);
CREATE INDEX idx_genre_name ON `genre`(name);
