# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Start Backend Server
```bash
npm start
```
You should see:
```
╔════════════════════════════════════════════╗
║  Kerberos Authentication Simulator        ║
║  Backend Server Running                   ║
╚════════════════════════════════════════════╝

📍 Server: http://localhost:5000
```

### Step 3: Install Frontend Dependencies (new terminal)
```bash
cd frontend
npm install
```

### Step 4: Start Frontend Development Server
```bash
npm run dev
```
You should see:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000
```

### Step 5: Open in Browser
Navigate to `http://localhost:3000` in your browser

### Step 6: Test the Application

**Credentials to use:**
- Username: `alice` → Password: `password123`
- Username: `bob` → Password: `secure_pass456`
- Username: `charlie` → Password: `my_password_789`

**Follow the flow:**
1. Enter credentials and click **Login**
2. Click **Request Service Ticket**
3. Click **Access Protected Resource**
4. View protected data and activity log

---

## 🛑 Troubleshooting

### "Connection refused" or "Cannot reach server"
- Ensure backend server is running on port 5000
- Check that `npm start` output shows the server is running
- Verify no other process is using port 5000

### "CORS error" in browser console
- Make sure backend server is running
- Verify frontend is using correct API URL: `http://localhost:5000`
- Clear browser cache and refresh

### Port already in use
- **Backend (5000):** Kill existing process or change port in vite.config.ts
- **Frontend (3000):** Change port in vite.config.ts

---

## 🧪 Test the Application Flow

### Quick Test (2 minutes)
1. Login with `alice` / `password123`
2. Click "Request Service Ticket"
3. Click "Access Protected Resource"
4. ✅ Done! View the activity log to see the entire flow

### Detailed Test (5 minutes)
1. Try invalid credentials (`alice` / `wrongpass`) - should see error
2. Login with correct credentials - should see success
3. View Activity Log - shows all steps
4. Request Service Ticket - shows TGS verification
5. Access Protected Resource - shows service verification
6. View protected data with API keys and database info

### Reset and Retry
- Click "Reset and Start Over" button to start a new flow
- All state will be cleared
- Activity log will reset
- Can immediately try different credentials

---

## 📚 Next Steps

### To Learn More
- Open `README.md` for detailed documentation
- Read `backend/server.js` for backend implementation
- Read `frontend/src/App.tsx` for frontend state management
- Check individual component files in `frontend/src/components/`

### To Extend
- Edit backend secret keys for security testing
- Add more test users to the mock database
- Change token expiration times
- Add custom service names
- Customize UI styling with Tailwind

---

## ⌨️ Keyboard Shortcuts

- `F12` - Open browser developer tools
- `Ctrl+Shift+Delete` - Clear browser cache (helpful if stuck)
- `Ctrl+C` - Stop server (in terminal)

---

**Everything set up? Start the application and begin exploring! 🎉**
