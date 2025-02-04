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
exports.fetchUser = exports.registerUser = exports.loginUser = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../../DatabaseConnection/db"));
const config_1 = require("../../../config");
const console_1 = require("console");
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
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = $1';
    try {
        const result = yield db_1.default.query(query, [username]);
        const user = result.rows[0];
        console.log(`User Found: ${JSON.stringify(user)}`);
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
        return;
        ;
    }
    catch (error) {
        console.error('Error logging in', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
});
exports.loginUser = loginUser;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const userFound = yield (0, exports.fetchUser)(undefined, username);
    if (userFound) {
        console.log(`User already Exists: ${userFound}. Cannot Create Account`);
        res.status(401).json({
            error: 'USER_EXISTS',
            message: `Username ${username} is already taken`
        });
        return;
    }
    const createUserMutation = `
  INSERT INTO 
    users (username, password)
  VALUES 
    ($1, $2);
  `;
    try {
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        const dbResult = yield db_1.default.query(createUserMutation, [
            username,
            passwordHash,
        ]);
        console.log(`DB Result from Create User: ${dbResult}`);
        const userFound = yield (0, exports.fetchUser)(undefined, username);
        if (userFound) {
            console.log(`User Created Successfully: ${userFound}`);
            res.status(200).json({ message: 'Success' });
            return;
        }
        else {
            console.log(`User Was Not Created`);
            res.status(403).json({
                error: 'DB_USER_FETCH_ERROR',
                message: 'Could not Fetch user from DB'
            });
            return;
        }
    }
    catch (_a) {
        console.log(`Error Creating User: ${console_1.error}`);
        res.status(403).json({
            error: 'DB_SCHEMA_UPDATE_ERROR',
            message: `Could not create user in DB: ${console_1.error}`
        });
        return;
    }
});
exports.registerUser = registerUser;
const fetchUser = (id, username) => __awaiter(void 0, void 0, void 0, function* () {
    const usernameExistsQuery = `SELECT * FROM users WHERE username = $1 LIMIT 1;`;
    const idExsitsQuery = `SELECT * FROM users WHERE id = $1 LIMIT 1;`;
    let currentQuery;
    if (id) {
        currentQuery = idExsitsQuery;
    }
    else if (username) {
        currentQuery = usernameExistsQuery;
    }
    else {
        return null;
    }
    try {
        const dbResult = yield db_1.default.query(currentQuery, [id || username || '']);
        console.log(`DB Result: ${JSON.stringify(dbResult)}`);
        if (dbResult.rowCount === 0) {
            console.log(`User Does Not yet Exist: ${id || username}`);
            return null;
        }
        const userFound = dbResult.rows[0];
        return {
            id: userFound.id,
            username: userFound.username,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        };
    }
    catch (_a) {
        console.error('Could not check database for user');
        ;
    }
    return null;
});
exports.fetchUser = fetchUser;
