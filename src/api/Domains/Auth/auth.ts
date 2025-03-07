import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction, RequestHandler } from "express";
import db from '../../DatabaseConnection/db';
import { JWT_SECRET } from "../../../config";
import { error } from "console";

// Middleware to check JWT token
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET!, (err: any) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    next();
  });
};

// Login user and return JWT token
export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = $1';
    try {
      const result = await db.query(query, [username]);
      const user = result.rows[0];
      console.log(`User Found: ${JSON.stringify({
        ...user, 
        ...req.body
      })}`);
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        console.log(`Invalid Validation`);
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      const token = jwt.sign({ userId: user.id }, JWT_SECRET!, { expiresIn: '1h' });
      res.status(200).json({ token });
      return;;
    } catch (error) {
      console.error('Error logging in', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  const userFound = await fetchUser(undefined, username);
  
  if (userFound) {
    console.log(`User already Exists: ${userFound}. Cannot Create Account`);
    res.status(401).json({
      error: 'USER_EXISTS', 
      message: `Username ${username} is already taken`
    });
    return
  }
  
  const createUserMutation = `
  INSERT INTO 
    users (username, password)
  VALUES 
    ($1, $2);
  `;
  
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const dbResult = await db.query(createUserMutation, [
      username,
      passwordHash,
    ]);
    console.log(`DB Result from Create User: ${dbResult}`);
    
    const userFound = await fetchUser(undefined, username);
    if (userFound) {
      console.log(`User Created Successfully: ${userFound}`);
      res.status(200).json({message: 'Success', id: userFound.id});;
      return;
    } else {
      console.log(`User Was Not Created`);
      
      res.status(403).json({ 
        error: 'DB_USER_FETCH_ERROR', 
        message: 'Could not Fetch user from DB'}
      );
      return
    }
    
  } catch {
    console.log(`Error Creating User: ${error}`);
    res.status(403).json({ 
      error: 'DB_SCHEMA_UPDATE_ERROR', 
      message: `Could not create user in DB: ${error}`
    });
    return;
  }
};




export default interface User {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
} 

export const fetchUser = async (
  id: string | undefined, 
  username: string | undefined
): Promise<User | null> => {
  
  const usernameExistsQuery = `SELECT * FROM users WHERE username = $1 LIMIT 1;`;
  const idExsitsQuery       = `SELECT * FROM users WHERE id = $1 LIMIT 1;`
  let currentQuery
  
  if (id) {
      currentQuery = idExsitsQuery;
  } else if (username) {
    currentQuery = usernameExistsQuery;
  } else { return null }
  
  try {
    const dbResult = await db.query(currentQuery, [id || username || '']);
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
    
  } catch {
    console.error('Could not check database for user');;
  }
  
  return null;
};