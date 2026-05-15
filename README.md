# Hospital Management System

A comprehensive, full-stack Hospital Management System built to manage daily hospital activities including doctors, patients, medicines, and billing receipts. 

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 with Vite
- **Routing:** React Router DOM
- **Directory:** `hospital-management-frontend`

### Backend
- **Framework:** Spring Boot 3.3.0 (Java 17)
- **Database:** PostgreSQL (hosted on Supabase)
- **ORM:** Spring Data JPA / Hibernate
- **Tools:** Maven, Lombok
- **Directory:** `hospitalManagementSystem`

## ✨ Features

- **Doctor Management:** Add, view, update, and manage doctor profiles.
- **Patient Management:** Track patient records and details.
- **Medicine Inventory:** Manage available medicines.
- **Receipts & Billing:** Generate and manage receipts for patients including prescribed medicines.

## 📁 Project Structure

```
hospitalManagementSystem/
├── hospital-management-frontend/   # React Frontend Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/                  # Doctors, Patients, Medicines, Receipts
│   │   ├── services/               # API service calls
│   │   └── App.jsx
│   └── package.json
└── hospitalManagementSystem/       # Spring Boot Backend Application
    ├── src/main/java/com/example/hospitalManagementSystem/
    │   ├── controller/             # REST APIs
    │   ├── entity/                 # Doctor, Patient, Medicine, Receipt
    │   ├── repository/             # JPA Repositories
    │   └── service/                # Business logic
    └── pom.xml
```

## 🚀 Getting Started

### Prerequisites
- Node.js
- Java Development Kit (JDK 17)

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd hospitalManagementSystem
   ```
2. The database is already configured in `application.properties` (connected to a managed PostgreSQL database via Supabase). If you want to use a local database, update the `spring.datasource.url`, `username`, and `password` inside `src/main/resources/application.properties`.
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd hospital-management-frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the provided localhost URL (usually `http://localhost:5173`) in your browser to view the application.
