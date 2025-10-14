import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth-request";
export declare const changeEmail: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const changePassword: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map