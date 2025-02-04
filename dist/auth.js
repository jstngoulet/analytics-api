"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import db from "./api/DatabaseConnection/db";
const config_1 = require("./config");
// Middleware to check JWT token
const authenticateJWT = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });
    jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET, (err) => {
        if (err)
            return res.status(403).json({ message: "Forbidden" });
        next();
    });
};
exports.authenticateJWT = authenticateJWT;
// Login user and return JWT token
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   const { username, password } = req.body;
    //   const query = 'SELECT * FROM users WHERE username = $1';
    //   try {
    //     const result = await db.query(query, [username]);
    //     const user = result.rows[0];
    //     if (!user || !(await bcrypt.compare(password, user.password))) {
    //       res.status(401).json({ message: 'Invalid credentials' });
    //       return;
    //     }
    //     const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    //     res.json({ token })
    //     return;;
    //   } catch (error) {
    //     console.error('Error logging in', error);
    //     res.status(500).json({ message: 'Internal server error' });
    //     return;
    //   }
});
exports.loginUser = loginUser;
