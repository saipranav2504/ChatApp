# ChatApp

A real-time chat application built with **React**, **Node.js**, **Express**, **Socket.IO**, and **MongoDB**.

---

## 📌 Features

- 🔐 User registration & login with JWT authentication  
- 💬 One-to-one and group chats  
- ⚡ Real-time messaging via Socket.IO  
- 🖼️ Profile pictures for users  
- ✏️ Create, rename & manage group chats  
- 📱 Responsive UI

---


## 🛠️ Tech Stack

- Frontend: React, Vite, TailwindCSS (optional)
- Backend: Node.js, Express.js
- Database: MongoDB (Atlas or local)
- Real-time: Socket.IO
- Auth: JSON Web Tokens (JWT)

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone <your-repo-url>
cd ChatApp

cd backend
npm install

PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>

npx nodemon server.js


cd ../frontend
npm install


