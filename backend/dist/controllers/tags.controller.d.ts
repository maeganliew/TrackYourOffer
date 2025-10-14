import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth-request";
export declare const addUserTag: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteUserTag: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserTag: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const editUserTag: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=tags.controller.d.ts.map