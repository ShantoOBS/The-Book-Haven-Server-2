# The Book Haven - Server

This repository contains the **backend/server-side code** for *The Book Haven*, a full-stack web application where users can explore, add, update, and delete books in a digital library. This backend is built with **Node.js**, **Express.js**, and **MongoDB Atlas**, and integrates with **Firebase Authentication** for user management.

---
## Live Link : https://the-book-haven-server-eozv2vc04-shanta-shils-projects.vercel.app/

-----
## 🛠 Technologies Used

- **Node.js** - JavaScript runtime for building the backend
- **Express.js** - Web framework for routing and API handling
- **MongoDB Atlas** - Cloud NoSQL database to store book and user data
- **Firebase Authentication** - Secure user authentication system
- **Axios** - Used for API calls on client-side (to interact with this server)
- **dotenv** - Environment variable management

---

## 🔗 API Routes

### Books

| Method | Route                   | Description                                         | Access      |
|--------|-------------------------|-----------------------------------------------------|------------|
| GET    | `/books`               | Get all books                                      | Public     |
| GET    | `/books/:id`           | Get a single book by ID                            | Public     |
| POST   | `/books`               | Add a new book                                     | Private    |
| PUT    | `/books/:id`           | Update a book (only by the owner)                 | Private    |
| DELETE | `/books/:id`           | Delete a book (only by the owner)                 | Private    |

### Users

| Method | Route                 | Description                                         | Access      |
|--------|-----------------------|-----------------------------------------------------|------------|
| POST   | `/register`           | Register a new user                                 | Public     |
| POST   | `/login`              | Login user with email/password                      | Public     |
| GET    | `/users/:id`          | Get user info                                      | Private    |

---

## 🔒 Authentication

- Firebase Authentication is used for secure login and registration.
- Private routes are protected, only authenticated users can add, update, or delete books.
- JWT tokens are validated for protected operations.

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/book-haven-server.git
   cd book-haven-server
