DROP TABLE IF EXISTS payroll_details;
DROP TABLE IF EXISTS payroll;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS position;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS movie_genre;
DROP TABLE IF EXISTS movie;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS user_role;
DROP TABLE IF EXISTS "user";

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE position (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    department_id INTEGER REFERENCES department(id)
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    position_id INTEGER REFERENCES position(id),
    hire_date DATE NOT NULL,
    eps VARCHAR(50),
    pension_fund VARCHAR(50),
    base_salary NUMERIC(10, 2) NOT NULL
);

CREATE TABLE payroll (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employee(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_salary NUMERIC(10, 2) NOT NULL
);

CREATE TABLE payroll_details (
    id SERIAL PRIMARY KEY,
    payroll_id INTEGER REFERENCES payroll(id),
    type VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT
);

CREATE TABLE movie (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_date DATE,
    director VARCHAR(100),
    rating NUMERIC(3, 1)
);

CREATE TABLE movie_genre (
    movie_id INTEGER REFERENCES movie(id),
    genre VARCHAR(50),
    PRIMARY KEY (movie_id, genre)
);

CREATE TABLE book (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100),
    publication_year INTEGER,
    isbn VARCHAR(20) UNIQUE,
    rating NUMERIC(3, 1)
);

CREATE TABLE "user" (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE TABLE user_role (
    user_id INTEGER REFERENCES "user"(id),
    role VARCHAR(20),
    PRIMARY KEY (user_id, role)
);

CREATE INDEX idx_employee_code ON employee(code);
CREATE INDEX idx_payroll_period ON payroll(period_start, period_end);
CREATE INDEX idx_movie_title ON movie(title);
CREATE INDEX idx_book_title ON book(title);
CREATE INDEX idx_book_author ON book(author);
