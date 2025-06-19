# Mini Notion Clone

A fully functional **Notion-like application** built with the **MERN stack** (MongoDB, Express, React, Node.js) and enhanced with **real-time collaboration**. This project is designed to be a modern, minimalist, and collaborative note-taking platform.

🌐 **Live Demo**: [https://mini-notion-clone.vercel.app/](https://mini-notion-clone.vercel.app/)
📂 **Source Code**: [GitHub Repository](https://github.com/Aul-rhmn/mini-notion-clone)

> ✅ You can register a new user, or test login with:
>
> * **Email**: `admin@gmail.com`
> * **Password**: `admin123`

---

## ✨ Features

* **Secure Authentication**

  * User registration & login with JWT stored in **HTTP-Only Cookies**.

* **Note Management**

  * Create, view, rename, and delete notes.
  * **Drag & Drop** to reorder notes in the sidebar.

* **Block-Based Editor**

  * Notes are composed of blocks (like Notion).
  * **Reorder blocks** via Drag & Drop.
  * **Supported block types**:

    * **Text** – regular paragraph text.
    * **Checklist** – interactive to-do list.
    * **Image** – insert via **file upload**, **drag-and-drop**, or **URL**.
    * **Code** – for code snippets with proper formatting.

* **Modern Functionalities**

  * **Autosave** – changes are saved automatically.
  * **Real-time Collaboration** – multiple users can edit the same note and see live updates.

* **Responsive UI**

  * Clean, modern, and mobile-friendly **dark theme** design.

---

## 💻 Tech Stack

### Backend

* Node.js + Express.js
* MongoDB + Mongoose
* Socket.IO (real-time)
* JWT for authentication
* Multer (image uploads)
* Helmet, CORS, Rate Limiting for security

### Frontend

* React.js + React Router
* Tailwind CSS
* Axios
* React Hook Form
* React ContentEditable
* React Beautiful DnD
* Socket.IO Client

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/)
* [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Aul-rhmn/mini-notion-clone.git
cd mini-notion-clone
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env     # create your environment config
npm install
npm run dev              # or: npm start
```

> Required ENV:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The app will run at [http://localhost:3000](http://localhost:3000) and connect to the backend at [http://localhost:5000](http://localhost:5000) (configured via Axios).

---

## 📝 License

Feel free to fork, improve, or contribute to the project.
