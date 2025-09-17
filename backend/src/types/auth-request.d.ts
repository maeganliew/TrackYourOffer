import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

//Even though your AuthenticatedRequest only mentions user, it still inherits everything from Request, including body.
export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string } | JwtPayload;
}