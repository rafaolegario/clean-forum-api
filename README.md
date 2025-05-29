# 📚 FORUM API

A fully featured **Forum REST API** built with **NestJS** using **Domain-Driven Design (DDD)** principles and the **Repository Pattern**. The system supports user authentication, question and answer posting, comments, and cloud-based file uploads.

This backend can serve as the foundation for platforms similar to Stack Overflow, learning forums, or any application that requires Q&A-style interactions.

---

## ✨ Features

- ✅ **User registration and JWT authentication**
- 🧠 **Domain-Driven Design (DDD)** architecture
- 📂 **Repository Pattern** for clean data access
- ❓ CRUD for questions and answers
- 💬 Commenting on both questions and answers
- ☁️ **Cloud-based file uploads** (e.g., Amazon S3, Cloudinary, or similar)
- 📑 REST Client-compatible `.http` file for easy API testing
- 📄 Pagination and filtering
- 🔒 Route protection with authentication guards
- ⚙️ Environment-based configuration

---

## 🛠 Tech Stack

- **NestJS** – Scalable Node.js framework
- **TypeScript** – Static typing
- **JWT** – Secure authentication
- **PostgreSQL / SQLite** – Relational databases
- **Prisma / TypeORM** – ORM for database access (depending on implementation)
- **Multer** – Middleware for handling `multipart/form-data` (file uploads)
- **Cloud Storage** – Amazon S3, Cloudinary, or equivalent
- **REST Client / Insomnia / Postman** – API testing

---
