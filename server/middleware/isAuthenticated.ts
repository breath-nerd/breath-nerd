import type { Request, Response, NextFunction } from 'express'

declare module 'express-session' {
  interface SessionData {
    userId: string
  }
}

const isAuthenticated = (req:Request, res:Response, next:NextFunction) => {
  const userId = req.session.userId

  if (!userId) {
    return res.status(401).json({error: 'Not authenticated'})
  }

  next()
}

export default isAuthenticated