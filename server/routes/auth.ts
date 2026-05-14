
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
import { isAuthenticated } from "../middleware/isAuthenticated";
import { supabase } from "../db/supabase";

// all imports are listed above are subject to added to. 


//  adding the const router from router. For the record and for studying purposes the Router's function is to create mini application in the main app
//  In addition, the router groups related routes and organize all utlized API. I welcome adding to this note.  

const router = express.Router();

router.get("/verify", isAuthenticated, async (req, res) => {
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

    //  request of a status check with catch error used
    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    //  This catch block handles unexpected runtime errors (e.g., database failure, undefined values, or server issues).
    // It returns a 500 Internal Server Error to indicate the problem is on the server side, not the client.
    // The actual error is not exposed to the client for security reasons.

  } catch (err) {
    return res.status(500).json({
      message: "Server error",
    });
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

router.post("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          // this message appears only if callback receive an error. For studying purpose Express tried to destroy the session, but the session store had a problem. 
          message: "Failed to log out",
        });
      }

      // clear cookie (name usually "connect.sid")
      res.clearCookie("connect.sid");

      return res.status(200).json({
        message: "Logged out successfully",
      });
    });
    // catch err added 
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;