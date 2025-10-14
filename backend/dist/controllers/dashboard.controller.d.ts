import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth-request";
export declare const getStats: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDashboardNudges: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=dashboard.controller.d.ts.map