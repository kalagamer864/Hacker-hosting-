# The Hacker Hosting
A free Minecraft server hosting website (frontend + simple mock backend).

**What is included**
- Frontend: HTML/CSS/JS for homepage, plans, signup/login, dashboard (mock UI).
- Backend: Node.js + Express server with JWT-based authentication (mocked, file-based storage).
- This is a starter template. Server management actions are mocked (no real Minecraft server orchestration).

**How to run (backend)**
1. Install Node.js (v18+ recommended).
2. cd backend
3. npm install
4. node server.js
5. Open `frontend/index.html` in your browser (or serve with a static server). The backend listens on http://localhost:4000

**Notes**
- All plans are free by design (no payments).
- This project is intended as a starting point — to connect real server orchestration you must integrate with container hosts, game server APIs, or your own orchestration layer.
