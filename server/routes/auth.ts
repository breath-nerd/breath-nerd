import express from "express";
import type { Request, Response, NextFunction } from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { supabase } from "../db/supabaseClient.js";

const router = express.Router();

// userId comes from session, not request body — prevents user from spoofing their own id
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
        error: "Not authenticated",
      });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    return next(err);
  }
});

// destroy session server-side before clearing cookie so the session can't be reused
router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      // clear cookie so browser doesn't send a dead session on next request
      res.clearCookie("connect.sid");

      return res.status(200).json({
        message: "Logged out",
      });
    });
  } catch (err) {
    return next(err);
  }
});

export default router;