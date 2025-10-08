import { authMiddleware } from '../../middleware/auth.middleware';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../../types/auth-request';

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 if no Authorization header', () => {
    authMiddleware(req as any, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token missing after Bearer', () => {
    req.headers = { authorization: 'Bearer ' };
    authMiddleware(req as any, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token missing" });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.headers = { authorization: 'Bearer invalidtoken' };
    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('invalid'); });

    authMiddleware(req as any, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next and attach user if token is valid', () => {
    const mockPayload = { id: 'user123', email: 'test@example.com' };
    req.headers = { authorization: 'Bearer validtoken' };
    (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

    authMiddleware(req as any, res, next);

    expect(req.user).toEqual(mockPayload);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});