import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth-request";
export declare const assertJobOwnership: (jobId: string | undefined, userId: string | undefined) => Promise<import("mongoose").Document<unknown, {}, {
    name: string;
    status: "Wishlist" | "Applied" | "Interview" | "Offer" | "Rejected" | "Withdrawn";
    userId: import("mongoose").Types.ObjectId;
    file?: {
        type?: string | null | undefined;
        filename?: string | null | undefined;
        url?: string | null | undefined;
    } | null | undefined;
    appliedAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    status: "Wishlist" | "Applied" | "Interview" | "Offer" | "Rejected" | "Withdrawn";
    userId: import("mongoose").Types.ObjectId;
    file?: {
        type?: string | null | undefined;
        filename?: string | null | undefined;
        url?: string | null | undefined;
    } | null | undefined;
    appliedAt?: NativeDate | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const addJob: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getJobs: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getJob: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const changeJobName: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const changeJobStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const changeJobDate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteJob: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const addJobTag: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteJobTag: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getJobTag: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const uploadFile: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteFile: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=jobs.controller.d.ts.map