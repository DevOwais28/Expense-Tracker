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
export const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
const port = process.env.PORT || 3000;

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';

connectDB(mongoURI);

const app = express();
app.use(session({
  secret: process.env.SESSION_SECRET, // Replace with a strong, random secret
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoURI }), // Configure your session store
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true, // Recommended for security
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(
  helmet({
    contentSecurityPolicy: envMode !== "DEVELOPMENT",
    crossOriginEmbedderPolicy: envMode !== "DEVELOPMENT",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*', credentials: true }));


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// your routes here
app.use("/api/users",userRoutes)

// app.get("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Page not found",
//   });
// });

app.use(errorMiddleware);

app.listen(port, () => console.log('Server is working on Port:' + port + ' in ' + envMode + ' Mode.'));
