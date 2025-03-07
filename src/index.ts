import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { authenticateJWT, loginUser, registerUser } from './api/Domains/Auth/auth';
import { sendEvent } from './api/Domains/Analytics/NewEvent';
// import { loginUser } from './playground';;
import { API_PORT } from './config';
const { body, validationResult } = require("express-validator");
import cors from 'cors';

dotenv.config();

const app = express();
const port = API_PORT;

const allowedOrigins: string[] = [
  "http://localhost:5173",
  "https://tizzle.dev",
  "*"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // bypass the requests with no origin (like curl requests, mobile apps, etc )
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json());

// Route to login and get JWT
app.post('/auth/login', loginUser);
app.post('/auth/register', registerUser);

//  Analytics Endpoint
app.post(
  "/analytics/new_event",
  [
    body("app_id").isLength({ min: 3 }).trim().escape(),
    body("user_id").isLength({ min: 3 }).trim().escape(),
    body("category").isLength({ min: 3 }).trim().escape(),
    body("action").isLength({ min: 3 }).trim().escape(),
    body("label").isLength({ min: 3 }).trim().escape(),
    body("timestamp").isLength({ min: 3 }).trim().escape()
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      console.error(`Result: ${JSON.stringify(req.body)}`);
      console.error(`Stopping request due to errors: ${{ ...errors.array() }}`);
      res.status(400).json({errors: errors.array() });
      return;
    }
    
    //  If not, just perform the standard function
    sendEvent(req, res);
  }
);



// Example of a protected route
// app.get('/protected', authenticateJWT, (req: Request, res: Response) => {
//   res.send('This is a protected route');
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
