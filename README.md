# 🚀 NestJS Authentication API

![NestJS](https://img.shields.io/badge/NestJS-Backend-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-green)
![Node.js](https://img.shields.io/badge/Driver-pg-yellow)

A simple **Authentication REST API** built with **NestJS** and **PostgreSQL** implementing a secure **JWT authentication system** using **Access Token** and **Refresh Token**.

This project intentionally avoids using **ORMs or Passport** in order to understand the **core mechanics of authentication, database interaction, and token handling**.

Instead, the project uses:

* Native **PostgreSQL driver (`pg`)**
* Direct **JWT service**
* Manual **Auth Guard implementation**

This approach helps build a stronger understanding of **backend fundamentals**.

---

# ✨ Features

✅ User Registration
✅ Secure Login System
✅ JWT Access Token Authentication
✅ Refresh Token Mechanism
✅ Logout / Token Revocation
✅ Password Hashing with bcrypt
✅ Refresh Token Hashing (SHA256)
✅ Protected Routes using Custom Auth Guard
✅ Direct PostgreSQL queries using `pg`

---

# 🧰 Tech Stack

### Backend Framework

* **NestJS**

### Database

* **PostgreSQL**

### Database Driver

* **pg (node-postgres)**
  Used instead of ORM to directly interact with the database.

### Authentication

* **JWT (JSON Web Token)** using `@nestjs/jwt`

### Security

* **bcrypt** → password hashing
* **SHA256** → refresh token hashing before storing in database

---

# 🏗 Architecture Overview

The project follows the **modular architecture** encouraged by NestJS.


src
│
├── auth
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts
│   └── dto
│
├── user
│   ├── user.service.ts
│   └── user.repository.ts
│
├── database
│   └── postgres.provider.ts
│
└── main.ts


Key design decisions:

* **No ORM used**
* Database queries are written manually using `pg`
* Authentication guard is implemented manually without Passport
* Clear separation between **controller**, **service**, and **data access**

---

# 🔐 Authentication Flow


flowchart TD

A[User Register] --> B[Hash Password with bcrypt]
B --> C[Store User in PostgreSQL]

D[User Login] --> E[Validate Password]
E --> F[Generate Access Token]
E --> G[Generate Refresh Token]

G --> H[Hash Refresh Token SHA256]
H --> I[Store Token in Database]

F --> J[Access Protected API]

K[Access Token Expired] --> L[Send Refresh Token]
L --> M[Validate Refresh Token]
M --> N[Generate New Access Token]
```

---

# 🔒 Security Implementation

## Password Hashing

Passwords are hashed using **bcrypt** before being stored.

```
password → bcrypt → stored in database
```

---

## Refresh Token Hashing

Refresh tokens are hashed before storing them.

```
refresh_token → sha256 → stored in database
```

This prevents attackers from directly using the refresh token if the database is compromised.

---

## Route Protection

Protected routes use a **custom Auth Guard** that:

1. Extracts the JWT from the request header
2. Verifies the token using `JwtService`
3. Attaches the user payload to the request object

Example header:

```
Authorization: Bearer access_token
```

---

# 📡 API Endpoints

## Register

```
POST /auth/register
```

Example request:

```json
{
  "name": "John Doe",
  "email": "john@mail.com",
  "password": "password123"
}
```

---

## Login

```
POST /auth/login
```

Response:

```json
{
  "access_token": "xxxx",
  "refresh_token": "xxxx"
}
```

---

## Refresh Token

```
POST /auth/refresh
```

Used to generate a new access token using the refresh token.

---

## Logout

```
POST /auth/logout
```

Removes refresh token from the database.

---

# ⚙️ Installation

Clone repository

```
git clone https://github.com/yourusername/nest-auth-api.git
```

Move into project directory

```
cd nest-auth-api
```

Install dependencies

```
npm install
```

---

# 🔧 Environment Variables

Create `.env` file:

```
DATABASE_URL=postgresql://user:password@localhost:5432/database

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
```

---

# ▶ Running the Application

Development mode:

```
npm run start:dev
```

Server will run on:

```
http://localhost:3000
```

---

# 🎯 Learning Objectives

This project was built to better understand:

* NestJS modular architecture
* JWT authentication flow
* Access Token & Refresh Token strategy
* Password hashing best practices
* Token hashing security
* Direct PostgreSQL usage with `pg`
* Implementing authentication **without relying on ORM or Passport**

---

# 🚧 Future Improvements

Planned improvements:

* Refresh Token Rotation
* Role-Based Access Control (RBAC)
* Rate Limiting
* Swagger API Documentation
* Unit Testing
* Docker Support
* Database migration system

---

# 👨‍💻 Author

**Hafidh**

Backend Developer (Learning Journey)
