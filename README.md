# Entrecol - Entertainment Collection Manager

## Overview

Entrecol is a full-stack web application for managing and analyzing entertainment content, specifically books and movies. It provides detailed analytics, reports, and visualization tools for understanding content consumption patterns and ratings.

## Features

- **Book Management**

  - Track books with detailed metadata (authors, publishers, ratings)
  - Search and filter capabilities
  - Rating analysis and statistics

- **Movie Management**

  - Organize movies by genres
  - Track release dates and ratings
  - Genre-based analytics

- **Analytics & Reports**
  - Generate comprehensive entertainment reports
  - Visualize data through interactive charts
  - Export reports to PDF
  - Filter data by date ranges
  - Sort and organize content by various metrics

## Tech Stack

- **Frontend**

  - Angular 18
  - Angular Material
  - NgxCharts
  - TypeScript
  - SCSS

- **Backend**
  - Spring Boot 3
  - Java 21
  - JPA/Hibernate
  - MySQL
  - iText PDF
  - JFreeChart

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Java 21 JDK (for local development)
- MySQL 9+ (handled by Docker)

## Getting Started

### Running with Docker Compose

1. Clone the repository:

   ```bash
   git clone https://github.com/Nick220505/Databases-I-Final-Project.git
   cd entrecol
   ```

2. Start the application:

   ```bash
   docker compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/swagger-ui.html

### Development Setup

#### Frontend

1. Navigate to the frontend directory:

   ```bash
   cd entrecol-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

#### Backend

1. Navigate to the backend directory:

   ```bash
   cd entrecol-backend
   ```

2. Run with Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
