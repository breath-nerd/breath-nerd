/*  ← starts comment
VERIFY ROUTE (GET /auth/verify)
--------------------------------
1. Check if session exists (middleware)
2. Get userId from session
3. Query database (Supabase) for user
4. If user not found or error → return 401
5. If user found → return 200 with user data
6. Catch unexpected errors → return 500
*/ 

//  Initiating Authentication - starting all the required imports. 
import express from "express";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";    
import { isAuthenticated } from "../middleware/isAuthenticated";
import { supabase } from "../db/supabaseClient";

// all imports are listed above are subject to added to. 


//  adding the const router from router. For the record and for studying purposes the Router's function is to create mini application in the main app
//  In addition, the router groups related routes and organize all utlized API. I welcome adding to this note.  

const router = express.Router();

router.get("/verify", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session.userId;

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    //  request of a statsus check with catch error used
    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    //  This catch block handles unexpected runtime errors (e.g., database failure, undefined values, or server issues).
    // It returns a 500 Internal Server Error to indicate the problem is on the server side, not the client.
    // The actual error is not exposed to the client for security reasons.

  } catch (err) {
    next(err);
  }
});

/*  ← starts comment
LOGOUT ROUTE (POST /auth/logout)
--------------------------------
1. Destroy current session
2. If error destroying session → return 500
3. Clear session cookie (connect.sid)
4. Return 200 success response
5. Catch unexpected errors → return 500

============
*/ 

router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      // clear cookie (name usually "connect.sid")
      res.clearCookie("connect.sid");

      return res.status(200).json({
        message: "Logged out successfully",
      });
    });
    // catch err added 
  } catch (err) {
    next(err);
  }
});

/* pseudo code 
Route: Post /auth/ signup  
use of try - extracl email, password, name from request body 
1. validate input - if any feild is missing, return an error bad message 
2. check if exist in the database, if it does, querry user's email = provided 
   -- if db erro, return 500 (server erro)
   -- if user exist, return 409 - return user already exist 
 3. use of hash password - call the bycrpt - create db, insert email, password, name into users table
 4. Start session then return a response  
 
*/ 
router.post("/signup", async (req: Request, res: Response, next: NextFunction) => { 
  try { 
    const { email, password, name } = req.body;     

    if (!email || !password || !name) { 
      return res.status(400).json({
        error: "User must provide correct name, email and password",
      }); 
    }

    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUserError) { 
      return next(existingUserError);
    }

    if (existingUser) {
      return res.status(409).json({
        error: "An account with that email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,  
        name,
      })
      .select("id, email, name")
      .single();

    if (insertError || !newUser) {
      return next(insertError);
    }

    req.session.userId = newUser.id;

    return res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (err) {
    next(err);
  }
});

/*pseudo code
1. Get email and password from request
2. Find user by email → if not found return 401
3. Compare password with stored hash → if mismatch return 401
4. Save userId to session and return 200 with user
 */
router.post("/login", async (req: Request, res: Response, next: NextFunction) => { 
  try { 
    const { email, password } = req.body; 
        
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, password")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    req.session.userId = user.id;

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    next(err);
  }
});
    
export default router;