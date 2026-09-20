# BorrowBox

### Borrow what you need. Lend what you don't.

BorrowBox is a full-stack MERN web application that enables users to **list items they own, discover items available nearby, and request them for borrowing**. It provides a structured borrowing workflow with authentication, item management, request handling, notifications, and image uploads.

The project is designed as a practical peer-to-peer borrowing platform for items such as books, cameras and electronics, tools, camping equipment, sports equipment, and agricultural tools.

---

## Features

###  Authentication & Authorization

* User registration and login
* JWT-based authentication
* Role-based authorization
* Protected routes and user-specific access

### Item Management

* Create and manage item listings
* Add item descriptions, categories, locations, and images
* Browse available items
* Search and filter items
* View detailed item information

###  Borrowing Workflow

* Borrowers can send requests for listed items
* Owners can review and manage incoming requests
* Request approval and rejection workflow
* Borrowing and return tracking
* Date-conflict validation to prevent overlapping bookings

### Notifications

* Real-time notifications using Socket.IO
* Notifications for important request and borrowing activities

### Image Uploads

* Item images uploaded through Cloudinary
* Multer used for handling image uploads on the backend

###  Admin Dashboard

* User management
* Item management
* Platform overview
* Analytics and visualizations using Recharts

---

## Tech Stack

### Frontend

* React 18
* Vite
* React Router
* Axios
* React Hook Form
* Recharts
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* Zod
* Socket.IO

### Services & Deployment

* MongoDB Atlas — Database
* Cloudinary — Image storage
* Vercel — Frontend deployment
* Render — Backend deployment

---

## Application Workflow

```text
User Registration / Login
          ↓
     Browse Items
          ↓
   View Item Details
          ↓
     Send Request
          ↓
 Owner Reviews Request
          ↓
   Approve / Reject
          ↓
    Borrowing Period
          ↓
       Return Item
```

---

## Project Structure

```text
borrowbox/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB Atlas account
* Cloudinary account

### 1. Clone the Repository

```bash
git clone https://github.com/deeksha-rai-alpha/borrowbox.git
cd borrowbox
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The application will then be available at the local Vite development URL.

> **Note:** Environment variables contain sensitive credentials and should not be committed to GitHub. Use `.env` files locally and configure environment variables separately when deploying.

---

## Deployment

BorrowBox can be deployed using:

| Component     | Service       |
| ------------- | ------------- |
| Frontend      | Vercel        |
| Backend       | Render        |
| Database      | MongoDB Atlas |
| Image Storage | Cloudinary    |

For production deployment, the frontend and backend environment variables need to be configured with their respective deployed URLs and service credentials.

---

## Key Technical Highlights

* Built a **full-stack MERN application** with separate frontend and backend architecture.
* Implemented **JWT authentication and protected routes**.
* Designed REST APIs for users, items, borrowing requests, and related workflows.
* Used **MongoDB and Mongoose** for data modeling and persistence.
* Implemented **real-time communication using Socket.IO**.
* Integrated **Cloudinary** for item image storage.
* Implemented **date-conflict validation** for borrowing requests.
* Built reusable React components and form handling using **React Hook Form**.
* Added an **admin dashboard with analytics and charts using Recharts**.
* Structured the application for deployment using **Vercel, Render, MongoDB Atlas, and Cloudinary**.

---

## Future Improvements

Potential improvements for future versions include:

* Improved recommendation and discovery features
* More detailed user ratings and reviews
* Enhanced location-based item discovery
* Additional analytics and reporting
* Improved mobile responsiveness and accessibility
* More advanced search and filtering capabilities

---

## Project Purpose

BorrowBox was developed as a practical full-stack project to understand how a modern web application works across the complete development lifecycle — from frontend development and REST API design to database management, authentication, third-party service integration, and cloud deployment.

---

## Author

**Deeksha Rai**

MCA Student | Full-Stack Web Development

GitHub: [deeksha-rai-alpha](https://github.com/deeksha-rai-alpha)

---

## License

This project is developed for educational and portfolio purposes.
