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
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = config_1.API_PORT;
app.use(express_1.default.json());
// Route to login and get JWT
app.post('/login', auth_1.loginUser);
app.post('/register', auth_1.registerUser);
//  Analytics Endpoint
app.post("/analytics/new_event", [
    body("app_id").isLength({ min: 3 }).trim().escape(),
    body("user_id").isLength({ min: 3 }).trim().escape(),
    body("category").isLength({ min: 3 }).trim().escape(),
    body("action").isLength({ min: 3 }).trim().escape(),
    body("label").isLength({ min: 3 }).trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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
