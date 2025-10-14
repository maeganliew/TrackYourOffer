import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth-request";
export declare const authMiddleware: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.middleware.d.ts.map