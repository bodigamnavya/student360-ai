import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { User, IUser, UserRole } from '../models/User';
import { sendError } from '../utils/response';

export interface AuthRequest extends Request {
  user?: IUser;
  token?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let token = '';
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendError(res, 'Authentication required. Please provide a valid token.', 401);
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; role: string };
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return sendError(res, 'User account not found or is deactivated.', 401);
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token has expired. Please log in again.', 401);
    }
    return sendError(res, 'Invalid authentication token.', 401);
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): any => {
    if (!req.user) {
      return sendError(res, 'Authentication required.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Role '${req.user.role}' is not authorized to access this resource.`,
        403
      );
    }

    next();
  };
};

export const generateTokens = (user: IUser) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
    department: user.department
  };

  const accessToken = jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: '7d'
  });

  const refreshToken = jwt.sign({ id: user._id }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: '30d'
  });

  return { accessToken, refreshToken };
};
