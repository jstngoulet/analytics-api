"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./api/Domains/Auth/auth");
const NewEvent_1 = require("./api/Domains/Analytics/NewEvent");
// import { loginUser } from './playground';;
const config_1 = require("./config");
const { body, validationResult } = require("express-validator");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = config_1.API_PORT;
const allowedOrigins = [
    "http://localhost:5173",
    "https://tizzle.dev",
    "*"
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // bypass the requests with no origin (like curl requests, mobile apps, etc )
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
}));
app.use(express_1.default.json());
// Route to login and get JWT
app.post('/auth/login', auth_1.loginUser);
app.post('/auth/register', auth_1.registerUser);
//  Analytics Endpoint
app.post("/analytics/new_event", [
    body("app_id").isLength({ min: 3 }).trim().escape(),
    body("user_id").isLength({ min: 3 }).trim().escape(),
    body("category").isLength({ min: 3 }).trim().escape(),
    body("action").isLength({ min: 3 }).trim().escape(),
    body("label").isLength({ min: 3 }).trim().escape(),
    body("timestamp").isLength({ min: 3 }).trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error(`Result: ${JSON.stringify(req.body)}`);
        console.error(`Stopping request due to errors: ${Object.assign({}, errors.array())}`);
        res.status(400).json({ errors: errors.array() });
        return;
    }
    //  If not, just perform the standard function
    (0, NewEvent_1.sendEvent)(req, res);
});
// Example of a protected route
// app.get('/protected', authenticateJWT, (req: Request, res: Response) => {
//   res.send('This is a protected route');
// });
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
