# Kerberos Authentication Protocol Simulator

A full-stack web application that demonstrates the Kerberos authentication protocol for academic purposes. This interactive simulator visualizes the three main components of Kerberos: Authentication Server (AS), Ticket Granting Server (TGS), and Service Server.

## 📋 Overview

This project implements a complete Kerberos authentication flow with three key steps:

### Step 1: Authentication (Client → AS)
- User provides username and password
- Authentication Server verifies credentials
- Issues a TGT (Ticket Granting Ticket) valid for 10 minutes
- Client stores the TGT

### Step 2: Ticket Granting (Client → TGS)
- Client presents TGT to the Ticket Granting Server
- TGS verifies the TGT using the shared secret with AS
- Issues a Service Ticket valid for 2 minutes
- Service Ticket is specific to a particular service

### Step 3: Service Access (Client → Service Server)
- Client presents Service Ticket to the protected resource
- Service Server verifies the ticket
- If valid, grants access to protected data
- Returns encrypted credentials and session information

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Lightning-fast development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend
- **Node.js** with **Express.js**
- **JSON Web Tokens (JWT)** - For token generation and verification
- **CORS** - Cross-Origin Resource Sharing enabled

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```

The backend server will run on `http://localhost:5000`

**Test Credentials:**
- Username: `alice` | Password: `password123`
- Username: `bob` | Password: `secure_pass456`
- Username: `charlie` | Password: `my_password_789`

**Available Endpoints:**
- `POST /as/login` - Authentication Server (login with credentials)
- `POST /tgs/request-service` - Ticket Granting Server (request service ticket)
- `GET /service/data` - Protected Resource Server (access protected data)
- `POST /debug/decode-token` - Debug endpoint (decode token payload)
- `GET /health` - Health check

### 2. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🏗️ Project Structure

```
kerberos/
├── backend/
│   ├── server.js                 # Express app with all 3 Kerberos components
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.tsx              # Main app component with state management
    │   ├── main.tsx             # React entry point
    │   ├── index.css            # Tailwind + custom styles
    │   ├── components/
    │   │   ├── Header.tsx       # Header with title and description
    │   │   ├── LoginCard.tsx    # Step 1: Authentication UI
    │   │   ├── ServiceTicketCard.tsx  # Step 2: Ticket Request UI
    │   │   ├── ServiceAccessCard.tsx  # Step 3: Resource Access UI
    │   │   ├── ActivityLog.tsx  # Live activity logger
    │   │   └── Footer.tsx       # Footer
    │   └── types/
    │       └── types.ts         # TypeScript interfaces
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tailwind.config.js
    └── package.json
```

## 🎯 Core Features

### ✅ Three-Step Kerberos Flow
1. **Authentication** - Verify credentials and issue TGT
2. **Ticket Granting** - Verify TGT and issue Service Ticket
3. **Service Access** - Verify Service Ticket and grant resource access

### ✅ Security Implementation
- **Token Expiration Handling** - Tickets expire after specific time intervals
- **Two Secret Keys System**:
  - `AS_TGS_SECRET` - Shared between AS and TGS
  - `TGS_SERVICE_SECRET` - Shared between TGS and Service
- **JWT Verification** - Each server verifies tokens using its secret
- **Step-by-Step Validation** - Cannot skip steps in the flow

### ✅ Real-Time Activity Log
- Shows all interactions between Client, AS, TGS, and Service
- Color-coded by status: Info (blue), Success (green), Warning (yellow), Error (red)
- Timestamps for each action
- Displays complete authentication flow history

### ✅ Beautiful UI/UX
- **Card-based Layout** - Each step is a separate, visually distinct card
- **Progressive Disclosure** - Next steps are disabled until previous steps complete
- **Responsive Design** - Works on desktop and tablet
- **Smooth Animations** - Framer Motion animations for interactive feedback
- **Status Indicators** - Visual feedback for active, pending, and completed steps

### ✅ Educational Features
- Clear explanations for each step
- Mock database with test credentials
- Protected data display showing API keys, database info, and access levels
- Debug endpoint for token inspection
- Inline comments explaining Kerberos concepts

## 💡 How to Use for Presentations

### Explaining the Flow
1. **Show Step 1**: Log in with credentials. Highlight that password is only sent once to AS.
2. **Show Step 2**: Request Service Ticket. Emphasize TGT proves authentication without resending password.
3. **Show Step 3**: Access protected resource. Highlight ticket-based authorization without credentials.
4. **Review Activity Log**: Show the complete message flow between all components.

### Key Concepts to Demonstrate
- **Credential Safety**: Password only sent in Step 1, never needed again
- **Delegation**: TGT proves you're authenticated to the entire Kerberos system
- **Service-Specific Access**: Each service validates its own tickets
- **Token Lifecycle**: Different expiration times for TGT (10 min) and Service Ticket (2 min)

## 🔐 Security Features Simulated

| Feature | Implementation | Benefit |
|---------|-----------------|---------|
| **Token Expiration** | JWT `expiresIn` property | Time-limited access |
| **Shared Secrets** | Two separate keys (AS_TGS, TGS_SERVICE) | Prevents unauthorized token creation |
| **JWT Verification** | `jwt.verify()` on token reception | Ensures token hasn't been tampered |
| **Service Validation** | Verify service name in token | Prevents using ST for wrong service |
| **Step Enforcement** | UI prevents skipping steps | Maintains proper flow |

## 🧪 Testing the Application

### Test Scenario 1: Successful Authentication Flow
1. Login with `alice` / `password123`
2. Click "Request Service Ticket"
3. Click "Access Protected Resource"
4. View protected data returned

### Test Scenario 2: Expired Token Handling
1. Wait for TGT to expire (10 minutes) or simulate expiration
2. Try to request service ticket - should see "TGT has expired" error
3. Need to login again

### Test Scenario 3: Invalid Credentials
1. Try logging in with `alice` / `wrongpassword`
2. Should see "Invalid credentials" error
3. Activity log shows authentication failure

### Test Scenario 4: Token Tampering
1. Copy a token from the browser's local state
2. Modify it slightly in the URL or request
3. API should reject with "Invalid or tampered Service Ticket"

## 📚 Understanding the Code

### Backend - server.js

**Authentication Server (AS)**
```javascript
app.post('/as/login', (req, res) => {
  // 1. Verify credentials from USERS_DB
  // 2. Create TGT with expiration
  // 3. Return TGT to client
})
```

**Ticket Granting Server (TGS)**
```javascript
app.post('/tgs/request-service', (req, res) => {
  // 1. Verify TGT using AS_TGS_SECRET
  // 2. Create Service Ticket with expiration
  // 3. Return Service Ticket to client
})
```

**Service Server**
```javascript
app.get('/service/data', (req, res) => {
  // 1. Verify Service Ticket using TGS_SERVICE_SECRET
  // 2. Validate service name matches
  // 3. Return protected data
})
```

### Frontend - App.tsx

**State Management**
```typescript
const [state, setState] = useState<AppState>({
  username, password,      // Step 1 inputs
  tgt, tgtExpiry,         // Step 1 outputs
  serviceTicket, serviceTicketExpiry,  // Step 2 outputs
  protectedData,          // Step 3 outputs
  currentStep,            // Tracks which step is active
  loading, error,         // UI state
  logs                    // Activity log entries
})
```

**Callbacks**
- `handleLogin` - Step 1: Send credentials to AS
- `handleRequestServiceTicket` - Step 2: Send TGT to TGS
- `handleAccessResource` - Step 3: Send Service Ticket to Service
- `addLog` - Append activity log entries

## 🎨 UI Components

### LoginCard
- Username and password inputs
- Submit button with loading state
- Error display
- Educational callout box

### ServiceTicketCard
- TGT status indicator
- Request button
- Error handling
- Step 2 explanation

### ServiceAccessCard
- Service Ticket status indicator
- Access button
- Protected data display (API key, database, access level, etc.)
- Step 3 explanation

### ActivityLog
- Color-coded entries by status
- Timestamp for each entry
- Actor identification (Client, AS, TGS, Service)
- Action description
- Scrollable history

## 🚧 Customization

### Change Secret Keys
Edit backend `server.js`:
```javascript
const AS_TGS_SECRET = 'your_new_secret_here';
const TGS_SERVICE_SECRET = 'another_secret_here';
```

### Add More Test Users
Edit backend `server.js`:
```javascript
const USERS_DB = {
  'alice': 'password123',
  'bob': 'secure_pass456',
  'charlie': 'my_password_789',
  'david': 'newpassword'  // Add new user
};
```

### Adjust Token Expiration
Edit backend `server.js`:
```javascript
// Change TGT expiration
jwt.sign(..., { expiresIn: '15m' })  // 15 minutes instead of 10

// Change Service Ticket expiration
jwt.sign(..., { expiresIn: '5m' })   // 5 minutes instead of 2
```

### Customize Service Name
Edit backend `server.js`:
```javascript
const SERVICE_NAME = 'CUSTOM_SERVICE';
```

## 📖 Educational Value

This simulator is perfect for:
- **Computer Science Students** - Understanding real authentication protocols
- **Security Courses** - Visualizing token-based authentication
- **Viva/Interview Prep** - Explaining Kerberos in live demonstrations
- **Tech Talks** - Showing how enterprise authentication works
- **Prototyping** - Base for building real Kerberos integrations

## 🔍 Debugging

### Backend Issues

**Check server is running:**
```bash
curl http://localhost:5000/health
```

**View server logs:**
- Check terminal where `npm start` is running
- Look for startup message with available endpoints

**Test endpoints with curl:**
```bash
# Test login
curl -X POST http://localhost:5000/as/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password123"}'
```

### Frontend Issues

**Check that backend is reachable:**
- Open browser console (F12)
- Check Network tab for API calls
- Verify API responses aren't showing CORS errors

**Clear browser cache:**
- Press `Ctrl+Shift+Delete` to open Clear Browsing Data
- Clear all cache data
- Refresh page

## 🤝 Contributing

To extend this project:
1. Add multi-realm support
2. Implement encryption for token payload
3. Add inter-realm authentication
4. Create database persistence
5. Add user registration
6. Implement delegation
7. Add constrained delegation support
8. Create service principal management UI

## 📝 License

This project is for educational purposes. Feel free to use, modify, and distribute.

## 🙏 Acknowledgments

This simulator is inspired by the official Kerberos protocol specifications and designed for academic learning and demonstration purposes.

---

**Happy Learning! 🚀**

For questions or improvements, feel free to modify the code and make it your own.
