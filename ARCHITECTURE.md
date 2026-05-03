# 🏛️ Kerberos Simulator - Technical Architecture

## System Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Port 3000)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  App.tsx - Main Component                               │  │
│  │  ├─ State Management (AppState)                         │  │
│  │  ├─ API Call Handlers                                   │  │
│  │  └─ Activity Log Management                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                       │
│        ┌─────────────────┼─────────────────┐                   │
│        │                 │                 │                   │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐             │
│  │ LoginCard│      │ Service  │      │ Service  │             │
│  │ Component│      │ Ticket   │      │ Access   │             │
│  │          │      │ Card     │      │ Card     │             │
│  │ (Step 1) │      │ (Step 2) │      │ (Step 3) │             │
│  └──────────┘      └──────────┘      └──────────┘             │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ActivityLog Component - Live Event Display              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTP API (CORS Enabled)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Port 5000)                        │
├─────────────────────────────────────────────────────────────────┤
│                      Express.js App                             │
│                                                                 │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │ Authentication  │  │   Ticket     │  │    Service       │ │
│  │ Server (AS)     │  │ Granting     │  │    Server        │ │
│  │                 │  │ Server (TGS) │  │                  │ │
│  │ POST /as/login  │  │              │  │ GET /service/data│ │
│  │                 │  │ POST /tgs/   │  │                  │ │
│  │ - Verify creds  │  │ request-     │  │ - Verify ST      │ │
│  │ - Issue TGT     │  │ service      │  │ - Grant access   │ │
│  │                 │  │              │  │ - Return data    │ │
│  │ Secret:         │  │ - Verify TGT │  │                  │ │
│  │ AS_TGS_SECRET   │  │ - Issue ST   │  │ Secret:          │ │
│  │                 │  │              │  │ TGS_SERVICE_     │ │
│  │ USERS_DB        │  │ Secret:      │  │ SECRET           │ │
│  │ {username: pw}  │  │ AS_TGS &     │  │                  │ │
│  │                 │  │ TGS_SERVICE_ │  │ Protected Data   │ │
│  │                 │  │ SECRET       │  │ {API keys, etc}  │ │
│  └─────────────────┘  └──────────────┘  └──────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Debug Endpoint: POST /debug/decode-token               │  │
│  │  Health Check: GET /health                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
App.tsx (Root Component)
├── Header.tsx
│   └── Welcome & Title
├── Main Content
│   ├── LoginCard.tsx
│   │   ├── Username Input
│   │   ├── Password Input
│   │   └── Login Button
│   ├── ServiceTicketCard.tsx
│   │   ├── TGT Status Display
│   │   └── Request Ticket Button
│   ├── ServiceAccessCard.tsx
│   │   ├── ST Status Display
│   │   ├── Access Button
│   │   └── Protected Data Display
│   ├── ActivityLog.tsx
│   │   └── Log Entry List
│   └── Educational Info Section
└── Footer.tsx
```

### State Management

```typescript
interface AppState {
  // Step 1: Authentication
  username: string;
  password: string;
  tgt: string | null;                    // JWT token from AS
  tgtExpiry: string | null;              // "10 minutes"

  // Step 2: Ticket Granting
  serviceTicket: string | null;          // JWT token from TGS
  serviceTicketExpiry: string | null;    // "2 minutes"

  // Step 3: Service Access
  protectedData: {                        // Data from Service
    username: string;
    service: string;
    resourceId: string;
    databaseName: string;
    accessLevel: string;
    apiKey: string;
    timestamp: string;
    sessionDuration: string;
  } | null;

  // UI State
  currentStep: number;                   // 1, 2, or 3
  loading: boolean;                      // Async operation in progress
  error: string | null;                  // Error message
  logs: LogEntry[];                      // Activity log entries
}
```

### Data Flow

```
User Input
    ↓
Component Handler (handleLogin, etc.)
    ↓
API Call (fetch to backend)
    ↓
Add Activity Log Entry
    ↓
Update State (setState)
    ↓
Re-render Components
    ↓
UI Update (new cards, logs, data)
```

### Component Lifecycle Example (Step 1: Login)

```
1. User enters username & password
2. Click "Login" button
3. handleLogin() called
4. addLog("Client", "Sending credentials...", "info")
5. setState({loading: true, error: null})
6. fetch POST /as/login with {username, password}
7. Response received:
   - If success: setState({tgt, tgtExpiry, currentStep: 2})
   - If error: setState({error: message})
8. Component re-renders showing updated UI
9. Activity log updated with success/error message
```

---

## Backend Architecture

### Express Route Structure

```javascript
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/as/login', handler);              // Authentication
app.post('/tgs/request-service', handler);   // Ticket Granting
app.get('/service/data', handler);           // Service Access
app.post('/debug/decode-token', handler);    // Debug
app.get('/health', handler);                 // Health Check
```

### Request/Response Flow

#### Step 1: Authentication

```
Request:
POST /as/login
Content-Type: application/json

{
  "username": "alice",
  "password": "password123"
}

Response (Success):
{
  "success": true,
  "message": "Authentication successful",
  "tgt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "alice",
  "expiresIn": "10 minutes"
}

Response (Failure):
{
  "success": false,
  "error": "Invalid credentials"
}
```

#### Step 2: Ticket Granting

```
Request:
POST /tgs/request-service
Content-Type: application/json

{
  "tgt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (Success):
{
  "success": true,
  "message": "Service Ticket issued",
  "serviceTicket": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "alice",
  "service": "DATA_SERVICE",
  "expiresIn": "2 minutes"
}

Response (Failure):
{
  "success": false,
  "error": "TGT has expired. Please login again."
}
```

#### Step 3: Service Access

```
Request:
GET /service/data?serviceTicket=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (Success):
{
  "success": true,
  "message": "Access granted to protected resource",
  "data": {
    "username": "alice",
    "service": "DATA_SERVICE",
    "resourceId": "db_connection_pool_123",
    "databaseName": "secure_database",
    "accessLevel": "read-write",
    "apiKey": "sk_test_4f5g8h9j0k1l2m3n4o5p6q7r8s9",
    "timestamp": "2024-01-15T10:30:45.123Z",
    "sessionDuration": "2 hours"
  }
}

Response (Failure):
{
  "success": false,
  "error": "Service Ticket has expired"
}
```

### Secret Key Management

```javascript
// Two Secret Keys - Never shared
const AS_TGS_SECRET = 'super_secret_as_tgs_key_12345';
const TGS_SERVICE_SECRET = 'super_secret_tgs_service_key_67890';

// Token Signing
// AS issues TGT:
jwt.sign(payload, AS_TGS_SECRET, {expiresIn: '10m'})

// TGS issues ST:
jwt.sign(payload, TGS_SERVICE_SECRET, {expiresIn: '2m'})

// Service verifies ST:
jwt.verify(serviceTicket, TGS_SERVICE_SECRET)

// TGS verifies TGT:
jwt.verify(tgt, AS_TGS_SECRET)
```

### User Database

```javascript
const USERS_DB = {
  'alice': 'password123',        // Hashed in production
  'bob': 'secure_pass456',
  'charlie': 'my_password_789'
};

// In production, this would be:
// - Encrypted database
// - Bcrypt/Argon2 password hashing
// - User management system
// - Directory integration (LDAP, etc.)
```

---

## JWT Token Structure

### TGT (Ticket Granting Ticket)

```json
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "username": "alice",
  "type": "TGT",
  "service": "krbtgt",
  "iat": 1705318245,
  "exp": 1705318845
}

// Signature: HMAC-SHA256(header.payload, AS_TGS_SECRET)
```

### ST (Service Ticket)

```json
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "username": "alice",
  "type": "ST",
  "service": "DATA_SERVICE",
  "tgtUsername": "alice",
  "iat": 1705318245,
  "exp": 1705318365
}

// Signature: HMAC-SHA256(header.payload, TGS_SERVICE_SECRET)
```

---

## Error Handling

### Frontend Error Handling

```typescript
try {
  const response = await fetch(endpoint);
  const data = await response.json();
  
  if (!data.success) {
    // API returned error response
    setState({error: data.error});
    addLog(actor, action, "error");
    return;
  }
  
  // Success
  setState({updatedState});
  addLog(actor, action, "success");
} catch (error) {
  // Network/fetch error
  setState({error: `Connection failed: ${error.message}`});
  addLog("System", `Connection failed: ${error.message}`, "error");
}
```

### Backend Error Handling

```javascript
app.post('/tgs/request-service', (req, res) => {
  try {
    const decoded = jwt.verify(tgt, AS_TGS_SECRET);
    
    // Handle verification errors
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'TGT has expired. Please login again.'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid TGT'
      });
    }
    // Generic error
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});
```

---

## Security Considerations

### What This Simulator Implements

| Feature | Implementation | Purpose |
|---------|-----------------|---------|
| Token Expiration | JWT `expiresIn` | Time-limited access |
| Shared Secrets | Two separate keys | Prevents forgery |
| Token Verification | `jwt.verify()` | Detects tampering |
| Service Validation | Check `service` field | Prevents misuse |
| Step Enforcement | UI state gates | Prevents skipping |

### What Production Kerberos Adds

| Feature | Why Needed |
|---------|-----------|
| TLS/SSL Encryption | Prevent network sniffing |
| Salted Password Hashing | Protect password database |
| Kerberos Realm | Multi-organization support |
| Cross-Realm Auth | Federated authentication |
| Delegation | Constrained service-to-service |
| Key Distribution Center | Secure key management |
| Replay Protection | Prevent token replay attacks |
| Clock Synchronization | Time-based ticket validation |

---

## Performance Characteristics

### Request Latencies

```
Step 1 (Auth):      ~50-200ms  (credential lookup)
Step 2 (TGS):       ~30-100ms  (JWT verification + signing)
Step 3 (Service):   ~20-80ms   (JWT verification)
```

### Token Sizes

```
TGT:            ~300-500 bytes
Service Ticket: ~300-500 bytes
Protected Data: ~500-1000 bytes
Activity Log:   ~50-100 bytes per entry
```

### Scalability

**Current Implementation:**
- Single backend server
- In-memory user database
- No persistence

**Production Implementation Would Need:**
- Load balancer
- Multiple servers
- Database (LDAP, Active Directory, custom DB)
- Caching layer (Redis)
- Monitoring and logging

---

## Development Workflow

### Local Development

```bash
# Terminal 1: Backend
cd backend
npm install
npm start

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Terminal 3: Testing/Debugging
# Open browser to http://localhost:3000
# Open DevTools to inspect network requests
```

### Production Deployment

**Frontend:**
```bash
npm run build  # Creates dist/ directory
# Deploy dist/ to static hosting (Netlify, Vercel, S3, etc.)
```

**Backend:**
```bash
# Set environment variables
export AS_TGS_SECRET=production_secret_1
export TGS_SERVICE_SECRET=production_secret_2

# Run with production settings
NODE_ENV=production npm start
```

---

## Testing Matrix

### Manual Testing Checklist

- [ ] Valid credentials → Success
- [ ] Invalid credentials → Error
- [ ] Expired TGT → Error
- [ ] Invalid TGT → Error
- [ ] Expired ST → Error
- [ ] Invalid ST → Error
- [ ] Wrong service name in ST → Error
- [ ] Network disconnection → Error handled
- [ ] Activity log updates correctly
- [ ] UI step progression works
- [ ] Reset functionality clears state

### Automated Testing (Future Enhancement)

```javascript
// Example test structure
describe('Authentication Flow', () => {
  test('Valid login returns TGT', async () => {
    const res = await fetch('/as/login', {
      body: {username: 'alice', password: 'password123'}
    });
    expect(res.data.tgt).toBeDefined();
  });
  
  test('Invalid credentials returns error', async () => {
    const res = await fetch('/as/login', {
      body: {username: 'alice', password: 'wrong'}
    });
    expect(res.data.success).toBe(false);
  });
  
  // More tests...
});
```

---

## Deployment Considerations

### Environment Variables

```bash
# Backend (.env)
NODE_ENV=production
PORT=5000
AS_TGS_SECRET=very_secure_secret_here
TGS_SERVICE_SECRET=another_secure_secret
CORS_ORIGIN=https://yourdomain.com

# Frontend (.env)
VITE_API_URL=https://api.yourdomain.com
```

### Docker Deployment (Future Enhancement)

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]

# Frontend Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY frontend .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

---

## Monitoring and Debugging

### Logging Strategy

```javascript
// Server logs
console.log(`[${timestamp}] [${level}] ${message}`);

// Frontend logs
addLog(actor, action, status);
```

### Debug Endpoints

```javascript
// Decode token without verification
POST /debug/decode-token
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Health check
GET /health
```

### Browser DevTools

1. **Network Tab**: See API calls and responses
2. **Console Tab**: JavaScript errors
3. **Storage Tab**: Local state (check localStorage)
4. **Application Tab**: Cookies and session data

---

## Future Enhancements

1. **Multi-Realm Kerberos**: Support for multiple domains
2. **Delegation**: Service-to-service authentication
3. **Encryption**: Encrypt ticket payload
4. **Database**: Replace USERS_DB with real database
5. **UI Improvements**: 3D animations, better visualizations
6. **Advanced Features**: OTP, certificate-based auth
7. **Compliance**: SOC2, GDPR, HIPAA considerations
8. **Performance**: Caching, optimization, load testing

---

**This architecture is designed for educational clarity while maintaining security best practices. For production use, additional hardening would be required.**
