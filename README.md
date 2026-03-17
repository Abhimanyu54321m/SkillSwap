#  SkillSwap – Freelance Skill Exchange Platform

A full-stack MERN application where freelancers exchange skills, connect, and chat in real-time.

## Tech Stack
- **Frontend**: React 18, Redux Toolkit, React Router v6, Socket.io-client, CSS Modules, Vite
- **Backend**: Node.js, Express.js, MongoDB + Mongoose, Socket.io, JWT Auth

## Features
-  JWT Authentication (Register / Login)
-  Search & Filter Freelancers by skill, location, rate
-  Connection Requests (send, accept, reject)
-  Real-time Chat with Socket.io (typing indicators, online status)
-  User Profiles with editable skills
-  Dashboard with stats and request management

## Project Structure
```
skillswap/
├── client/              # React frontend (Vite)
│   └── src/
│       ├── pages/       # Home, Login, Search, Profile, Chat
│       ├── components/  # Navbar, UserCard, SkillTag, ChatBox
│       ├── redux/       # store.js, userSlice.js
│       └── api/         # api.js (Axios)
└── server/              # Express backend
    ├── controllers/     # authController, userController, requestController
    ├── models/          # User, Request, Message
    ├── routes/          # authRoutes, userRoutes, requestRoutes, messageRoutes
    ├── middleware/      # isAuth.js (JWT guard)
    └── utils/           # token.js
```

## Setup & Run

### 1. Install Dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment
Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

### 3. Run Development Servers

**Backend** (Terminal 1):
```bash
cd server
npm run dev
```

**Frontend** (Terminal 2):
```bash
cd client
npm run dev
```

### 4. Open
Visit **https://skill-swap-67zi.vercel.app**

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Users
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/users | Get all users (with filters) |
| GET | /api/users/:id | Get user by ID |
| PUT | /api/users/profile | Update own profile |
| GET | /api/users/connections | Get my connections |

### Requests
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/requests | Send connection request |
| GET | /api/requests | Get sent & received requests |
| PUT | /api/requests/:id | Accept or reject |
| DELETE | /api/requests/:id | Cancel sent request |

### Messages
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/messages/:roomId | Get chat history |

### Socket Events
| Event | Direction | Description |
|-------|-----------|-------------|
| user_online | Client → Server | Register online status |
| join_room | Client → Server | Join a chat room |
| send_message | Client → Server | Send a message |
| receive_message | Server → Client | Receive a message |
| typing / stop_typing | Client → Server | Typing indicator |
| user_typing / user_stop_typing | Server → Client | Show typing indicator |
| online_users | Server → Client | Broadcast online users list |
