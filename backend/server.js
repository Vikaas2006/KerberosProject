import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 5000;

// Secret keys for signing tokens
// In real Kerberos: AS and TGS share secret, TGS and Service share different secret
const AS_TGS_SECRET = 'super_secret_as_tgs_key_12345';
const TGS_SERVICE_SECRET = 'super_secret_tgs_service_key_67890';

// Mock user database
const USERS_DB = {
  'alice': 'password123',
  'bob': 'secure_pass456',
  'charlie': 'my_password_789'
};

// Service information
const SERVICE_NAME = 'DATA_SERVICE';

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// STEP 1: AUTHENTICATION SERVER (AS)
// ============================================
// Client sends credentials → AS verifies and issues TGT
app.post('/as/login', (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Username and password required'
    });
  }

  // Check credentials against mock database
  if (USERS_DB[username] !== password) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  try {
    // Create TGT (Ticket Granting Ticket)
    // This token proves the user is authenticated to the Kerberos system
    const tgt = jwt.sign(
      {
        username,
        type: 'TGT', // Identifies this as a Ticket Granting Ticket
        service: 'krbtgt' // Standard service name for TGT
      },
      AS_TGS_SECRET,
      { expiresIn: '10m' } // TGT valid for 10 minutes
    );

    res.json({
      success: true,
      message: 'Authentication successful',
      tgt,
      username,
      expiresIn: '10 minutes'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Token generation failed'
    });
  }
});

// ============================================
// STEP 2: TICKET GRANTING SERVER (TGS)
// ============================================
// Client sends TGT → TGS verifies TGT and issues Service Ticket
app.post('/tgs/request-service', (req, res) => {
  const { tgt } = req.body;

  if (!tgt) {
    return res.status(400).json({
      success: false,
      error: 'TGT required'
    });
  }

  try {
    // Verify the TGT using the AS_TGS_SECRET
    // This proves the user has already authenticated with AS
    const decoded = jwt.verify(tgt, AS_TGS_SECRET);

    // Validate TGT structure
    if (decoded.type !== 'TGT') {
      return res.status(401).json({
        success: false,
        error: 'Invalid ticket type'
      });
    }

    const { username } = decoded;

    // Create Service Ticket (ST)
    // This token proves the user is authorized to access a specific service
    const serviceTicket = jwt.sign(
      {
        username,
        type: 'ST', // Identifies this as a Service Ticket
        service: SERVICE_NAME, // Specifies which service this ticket is for
        tgtUsername: username // Reference back to the TGT issuer
      },
      TGS_SERVICE_SECRET,
      { expiresIn: '2m' } // Service Ticket valid for 2 minutes (short-lived)
    );

    res.json({
      success: true,
      message: 'Service Ticket issued',
      serviceTicket,
      username,
      service: SERVICE_NAME,
      expiresIn: '2 minutes'
    });
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
    res.status(500).json({
      success: false,
      error: 'Service ticket generation failed'
    });
  }
});

// ============================================
// STEP 3: SERVICE SERVER (Protected Resource)
// ============================================
// Client sends Service Ticket → Service verifies and returns protected data
app.get('/service/data', (req, res) => {
  const { serviceTicket } = req.query;

  if (!serviceTicket) {
    return res.status(400).json({
      success: false,
      error: 'Service Ticket required'
    });
  }

  try {
    // Verify the Service Ticket using TGS_SERVICE_SECRET
    // This proves the user is authorized by TGS to access this service
    const decoded = jwt.verify(serviceTicket, TGS_SERVICE_SECRET);

    // Validate Service Ticket structure
    if (decoded.type !== 'ST') {
      return res.status(401).json({
        success: false,
        error: 'Invalid ticket type. Expected Service Ticket.'
      });
    }

    // Validate service name matches
    if (decoded.service !== SERVICE_NAME) {
      return res.status(403).json({
        success: false,
        error: `Service ticket is for ${decoded.service}, not ${SERVICE_NAME}`
      });
    }

    const { username } = decoded;

    // Access granted! Return protected data
    const protectedData = {
      success: true,
      message: 'Access granted to protected resource',
      data: {
        username,
        service: SERVICE_NAME,
        resourceId: 'db_connection_pool_123',
        databaseName: 'secure_database',
        accessLevel: 'read-write',
        apiKey: 'sk_test_' + Math.random().toString(36).substr(2, 20),
        timestamp: new Date().toISOString(),
        sessionDuration: '2 hours'
      }
    };

    res.json(protectedData);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Service Ticket has expired. Request a new one from TGS.'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid or tampered Service Ticket'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Service access failed'
    });
  }
});

// ============================================
// DEBUG ENDPOINT (for testing)
// ============================================
// Allows decoding tokens for debugging without verification
app.post('/debug/decode-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: 'Token required'
    });
  }

  try {
    const decoded = jwt.decode(token, { complete: true });
    res.json({
      success: true,
      header: decoded.header,
      payload: decoded.payload,
      signature: decoded.signature
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid token format'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'Kerberos Auth Server is running',
    components: {
      as: 'Authentication Server',
      tgs: 'Ticket Granting Server',
      service: 'Protected Resource Server'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  Kerberos Authentication Simulator        ║
║  Backend Server Running                   ║
╚════════════════════════════════════════════╝

📍 Server: http://localhost:${PORT}

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
  `);
});
