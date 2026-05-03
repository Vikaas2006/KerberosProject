# 🚀 Complete Installation & Startup Guide

## For All Operating Systems (Windows, macOS, Linux)

---

## Prerequisites Check

Before you start, verify you have:

```bash
# Check Node.js is installed
node --version
# Should output: v16.0.0 or higher

# Check npm is installed
npm --version
# Should output: 8.0.0 or higher
```

**Don't have Node.js?** Download from [nodejs.org](https://nodejs.org/)
- Choose LTS version (recommended)
- Includes npm automatically

---

## Option 1: Automatic Setup (Recommended)

### Windows Users

```bash
# Open Command Prompt or PowerShell in the project directory
# Then run:
setup.bat
```

### macOS & Linux Users

```bash
# Open Terminal in the project directory
# Then run:
chmod +x setup.sh
./setup.sh
```

**This will:**
- Install backend dependencies
- Install frontend dependencies
- Show you next steps

---

## Option 2: Manual Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

**Expected output:**
```
added XXX packages in XX.XXs
```

### Step 2: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

**Expected output:**
```
added XXX packages in XX.XXs
```

---

## Running the Application

### Terminal Setup

You'll need **2-3 terminal windows**:
1. **Terminal 1**: Backend server
2. **Terminal 2**: Frontend dev server
3. **Terminal 3** (optional): Browser

### Start Backend Server

**In Terminal 1:**

```bash
cd backend
npm start
```

**Expected output:**
```
╔════════════════════════════════════════════╗
║  Kerberos Authentication Simulator        ║
║  Backend Server Running                   ║
╚════════════════════════════════════════════╝

📍 Server: http://localhost:5000

🔐 Available Endpoints:
   POST   /as/login                  (Authentication Server)
   POST   /tgs/request-service       (Ticket Granting Server)
   GET    /service/data              (Protected Resource)
   POST   /debug/decode-token        (Debug)
   GET    /health                    (Health Check)

📚 Test Credentials:
   Username: alice     Password: password123
   Username: bob       Password: secure_pass456
   Username: charlie   Password: my_password_789

⚠️  Waiting for frontend connections...
```

**✓ Backend is running!** Keep this terminal open.

---

### Start Frontend Dev Server

**In Terminal 2:**

```bash
cd frontend
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 123 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

**✓ Frontend is running!** Keep this terminal open.

---

### Open in Browser

**In Terminal 3 (or manually):**

```bash
# Windows
start http://localhost:3000

# macOS
open http://localhost:3000

# Linux
xdg-open http://localhost:3000

# Or manually: Type in browser address bar
http://localhost:3000
```

**You should see:**
- Kerberos Authentication Protocol Simulator title
- Step 1: Authentication card
- Login input fields
- Activity Log panel

---

## Using the Application

### Test Credentials

Use any of these credentials to login:

| Username | Password |
|----------|----------|
| alice | password123 |
| bob | secure_pass456 |
| charlie | my_password_789 |

### Step-by-Step Flow

1. **Step 1 - Authentication**
   - Enter username: `alice`
   - Enter password: `password123`
   - Click "Login"
   - Watch Activity Log for success message
   - TGT will be displayed (stored in state)

2. **Step 2 - Ticket Granting**
   - Click "Request Service Ticket"
   - TGT is sent to TGS
   - Service Ticket is generated
   - Watch Activity Log for TGS verification message

3. **Step 3 - Service Access**
   - Click "Access Protected Resource"
   - Service Ticket is sent to service
   - Protected data is returned
   - View API keys, database info, access levels

4. **Reset Flow**
   - Click "🔄 Reset and Start Over"
   - All state is cleared
   - Ready to try again with different credentials

---

## Troubleshooting

### Issue: "Cannot GET http://localhost:3000"

**Solution:**
- Ensure frontend dev server is running (Terminal 2)
- Check that output shows `VITE ready in XXX ms`
- Wait 2-3 seconds and refresh browser

---

### Issue: "Connection refused" or "Error: fetch failed"

**Solution:**
- Ensure backend is running on port 5000
- Check Terminal 1 shows `Backend Server Running`
- Try curl test:
  ```bash
  curl http://localhost:5000/health
  ```
- Should return JSON response

---

### Issue: Port 5000 or 3000 already in use

**Solution - Find and kill existing process:**

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:5000
kill -9 <PID>
```

**Or change port in** `frontend/vite.config.ts`:
```typescript
server: {
  port: 3001,  // Changed from 3000
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      // ...
    }
  }
}
```

---

### Issue: "npm: command not found"

**Solution:**
- Node.js not properly installed
- Download from [nodejs.org](https://nodejs.org/)
- Restart terminal or computer after installation
- Verify: `node --version` and `npm --version`

---

### Issue: Blank page or no content displays

**Solution:**
- Check browser console for errors (F12 → Console tab)
- Verify backend is responding: `curl http://localhost:5000/health`
- Clear browser cache:
  - Chrome/Edge: Ctrl+Shift+Delete
  - Firefox: Ctrl+Shift+Delete
  - Safari: Develop → Clear Caches
- Refresh page: Ctrl+F5 (hard refresh)

---

### Issue: Activity Log shows errors

**Common errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot connect to server" | Backend not running | Start backend with `npm start` in `/backend` |
| "Invalid credentials" | Wrong password | Check credentials in USERS_DB (alice/password123, etc.) |
| "TGT has expired" | Waited 10+ minutes | Click "Reset and Start Over" to login again |
| "Invalid TGT" | Token tampered or corrupted | Refresh page and login again |

---

## Development vs. Production

### Development Mode (Current Setup)

- Hot reload: Changes update automatically
- Full error messages and logs
- CORS enabled for localhost
- Console shows all activity
- Use for testing and learning

### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# This creates a `/dist` folder with optimized files
# Deploy this folder to web hosting

# Run backend
NODE_ENV=production npm start
```

---

## Accessing the Application from Other Devices

### Same Network (LAN)

Find your computer's IP address:

**Windows:**
```bash
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
```

**macOS/Linux:**
```bash
ifconfig
# Look for inet address (e.g., 192.168.1.100)
```

Then open on other device:
```
http://192.168.1.100:3000
```

### Over Internet (Not Recommended for Learning)

- Requires port forwarding or VPN
- Security risks
- Not recommended for local development
- Use cloud hosting for public access

---

## Stopping the Servers

### Stop Backend
In Terminal 1:
```bash
Ctrl + C
# Or Cmd + C on macOS
```

### Stop Frontend
In Terminal 2:
```bash
Ctrl + C
# Or Cmd + C on macOS
```

Both servers will stop. You can restart them anytime.

---

## Next Steps After Setup

### 1. Read the Documentation

- `README.md` - Complete project overview
- `QUICKSTART.md` - Quick 5-minute guide
- `PRESENTATION_GUIDE.md` - For explaining to others
- `ARCHITECTURE.md` - Technical deep dive

### 2. Explore the Code

**Backend:**
- `backend/server.js` - All three Kerberos components
- Comments explain each step
- Easy to modify and extend

**Frontend:**
- `frontend/src/App.tsx` - Main application logic
- `frontend/src/components/` - Individual UI components
- `frontend/src/types/types.ts` - TypeScript interfaces

### 3. Run for Presentation

- Follow steps in `PRESENTATION_GUIDE.md`
- Practice the flow once before presenting
- Have all files ready

### 4. Customize (Optional)

Edit `backend/server.js` to:
- Change secret keys
- Add more test users
- Adjust expiration times
- Modify service names

---

## Performance Monitoring

### Check Backend Logs

Terminal 1 (Backend) shows:
- Incoming requests
- Validation results
- Token generation
- Any errors

### Check Frontend Logs

Browser Console (F12 → Console shows):
- API responses
- State changes
- Errors
- Activity log entries

### Monitor Network Requests

Browser Network Tab (F12 → Network):
- See all HTTP requests to backend
- Check request/response bodies
- View headers and timing

---

## Common Commands Reference

```bash
# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build

# Install dependencies again
npm install

# Check if port is in use
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -ti:5000

# Test backend health
curl http://localhost:5000/health

# View package versions
npm list
```

---

## Support & Troubleshooting

### If Something Breaks

1. **Stop both servers** (Ctrl+C)
2. **Clear node_modules**:
   ```bash
   cd backend && rm -rf node_modules && npm install
   cd ../frontend && rm -rf node_modules && npm install
   ```
3. **Restart servers** in order: backend first, then frontend
4. **Clear browser cache** (Ctrl+Shift+Delete)
5. **Hard refresh** browser (Ctrl+F5)

### Getting Help

Check these files in order:
1. `QUICKSTART.md` - Quick solutions
2. `README.md` - Detailed explanations
3. `PRESENTATION_GUIDE.md` - Understanding concepts
4. `ARCHITECTURE.md` - Technical details

---

## ✅ Verification Checklist

Run through this to verify everything is working:

- [ ] Backend server running on http://localhost:5000
- [ ] Frontend server running on http://localhost:3000
- [ ] Browser shows Kerberos UI
- [ ] Login with credentials works
- [ ] Activity log shows messages
- [ ] Request Service Ticket works
- [ ] Access Protected Resource works
- [ ] Protected data is displayed
- [ ] Reset button clears state
- [ ] No errors in browser console

**If all checked ✓ - You're ready to go!**

---

## 🎉 You're All Set!

The Kerberos Authentication Protocol Simulator is now running. 

**Next:**
- Follow the interactive flow in the UI
- Read PRESENTATION_GUIDE.md to explain to others
- Check ARCHITECTURE.md to understand how it works
- Modify code and explore further

**Enjoy learning about Kerberos! 🚀**

---

**Questions or issues?** Refer to the troubleshooting section above or check the documentation files.
