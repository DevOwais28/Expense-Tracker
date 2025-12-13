import express from "express"
import "dotenv/config";
import helmet from "helmet"
import cors from 'cors'
import { errorMiddleware } from "./middlewares/error.js"
import session from "express-session"
import { connectDB } from "./lib/db.js"
import MongoStore from "connect-mongo"
import passport from "./config/passport.js"
import userRoutes from "./routes/user.js"
import predictionRoutes from "./routes/prediction.js"
import expenseRoutes from "./routes/expense.js"
import adminRoutes from "./routes/admin.js"
import multer from "multer"
import path from "path"
import fs from "fs"
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
export const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
const port = process.env.PORT || 4000;

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/expense-tracker';

connectDB(mongoURI);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// CORS middleware first
app.use(cors({
  origin: ['https://expense-tracker-glpp.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add file upload middleware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp and original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});
app.use(upload.single('avatar'));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-for-development', 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoURI,
    collectionName: 'sessions',
    ttl: 60 * 60 * 24 // 1 day in seconds
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: "none",
    secure: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for now
    crossOriginEmbedderPolicy: false, // Disable this too
  })
);

app.use(express.urlencoded({ extended: true }));

// Health check endpoint - no dependencies
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    port: port
  });
});

// Remove duplicate route handler - keeping the final one

// Test session endpoint
app.get('/test-session', (req, res) => {
  console.log('=== SESSION DEBUG INFO ===');
  console.log('Session ID:', req.sessionID);
  console.log('Session data:', req.session);
  console.log('Cookies:', req.headers.cookie);
  console.log('User ID in session:', req.session.userId);
  console.log('Passport session:', req.session.passport);
  console.log('req.user:', req.user);
  console.log('req.isAuthenticated():', req.isAuthenticated && req.isAuthenticated());
  console.log('========================');
  
  // Test MongoDB session store connection
  const MongoStore = require('connect-mongo');
  const store = MongoStore.create({
    mongoUrl: mongoURI,
    collectionName: 'sessions'
  });
  
  store.get(req.sessionID, (err, session) => {
    if (err) {
      console.log('Store error:', err);
      return res.status(500).json({ error: 'Store error' });
    }
    
    console.log('Session from store:', session);
    
    res.json({ 
      sessionId: req.sessionID,
      sessionData: req.session,
      hasUserId: !!req.session.userId,
      hasPassport: !!req.session.passport,
      hasUser: !!req.user,
      isAuthenticated: req.isAuthenticated && req.isAuthenticated(),
      storeSession: session ? 'found' : 'not found'
    });
  });
});

// your routes here
app.use("/api/users",userRoutes)
app.use("/api/prediction",predictionRoutes)
app.use("/api/expenses",expenseRoutes)
app.use("/api/admin",adminRoutes)
// app.get("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Page not found",
//   });
// });

app.use(errorMiddleware);

app.listen(port, () => console.log('Server is working on Port:' + port + ' in ' + envMode + ' Mode.'));
