import jwt from 'jsonwebtoken';
import { AppError } from '#/errors/index.js';

export function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
  } catch {
    // invalid token — treat as anonymous
  }
  next();
}

export default function protect(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) throw new AppError('Not authorized, no token', 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    next(new AppError('Not authorized', 401));
  }
}
