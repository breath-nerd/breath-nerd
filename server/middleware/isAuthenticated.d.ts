import type { Request, Response, NextFunction } from 'express';
declare module 'express-session' {
    interface SessionData {
        userId: string;
    }
}
declare const isAuthenticated: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export { isAuthenticated };
//# sourceMappingURL=isAuthenticated.d.ts.map