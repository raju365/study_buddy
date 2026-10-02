
---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- A Gemini API key ([Google AI Studio](https://aistudio.google.com))

### 1. Clone the repo
```bash
git clone https://github.com/raju365/study-buddy.git
cd study-buddy
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

```bash
npm run dev
```

App runs at `http://localhost:5173`, API at `http://localhost:5000`.

---

## 🧠 How the AI-to-Peer Handoff Works

1. Student asks a doubt → Gemini generates an explanation **and** auto-detects a normalized topic name.
2. Backend checks: has anyone else asked about this exact topic in the last 30 minutes?
3. If yes, a banner shows how many peers are stuck on it, with a **"Join live room"** button.
4. Clicking it finds-or-creates a Socket.IO room scoped to that subject + topic, and drops the student into real-time chat with others who hit the same wall.

---

## 👤 Author

**Raju Barman** — MERN Stack Developer
[Portfolio](https://portfolio-raju365.vercel.app) · [LinkedIn](https://linkedin.com/in/raju-barman365) · [GitHub](https://github.com/Raju365)

