import { Request, Response } from 'express';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { AuditLog } from '../models/AuditLog';
import { generateTokens, AuthRequest } from '../middleware/auth.middleware';
import { registerSchema, loginSchema } from '../validators';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);

  const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
  if (existingUser) {
    return sendError(res, 'An account with this email already exists.', 409);
  }

  const user = await User.create({
    name: validatedData.name,
    email: validatedData.email.toLowerCase(),
    password: validatedData.password,
    role: validatedData.role,
    department: validatedData.department
  });

  if (user.role === 'student') {
    const slug = validatedData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);
    const rollNumber = validatedData.rollNumber || `23CS${Math.floor(100 + Math.random() * 900)}`;

    await StudentProfile.create({
      user: user._id,
      rollNumber,
      department: validatedData.department,
      publicSlug: slug
    });
  }

  await AuditLog.create({
    user: user._id,
    userEmail: user.email,
    userRole: user.role,
    action: 'USER_REGISTERED',
    entity: 'User',
    entityId: user._id.toString()
  });

  const { accessToken, refreshToken } = generateTokens(user);

  return sendSuccess(
    res,
    'Registration successful',
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar
      },
      accessToken,
      refreshToken
    },
    201
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);

  const user = await User.findOne({ email: validatedData.email.toLowerCase() }).select('+password');
  if (!user) {
    return sendError(res, 'Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(validatedData.password);
  if (!isMatch) {
    return sendError(res, 'Invalid email or password', 401);
  }

  if (!user.isActive) {
    return sendError(res, 'Your account is deactivated. Please contact support.', 403);
  }

  const { accessToken, refreshToken } = generateTokens(user);

  // Update refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  await AuditLog.create({
    user: user._id,
    userEmail: user.email,
    userRole: user.role,
    action: 'USER_LOGIN',
    entity: 'User',
    entityId: user._id.toString()
  });

  // Get student profile if student
  let profile = null;
  if (user.role === 'student') {
    profile = await StudentProfile.findOne({ user: user._id });
  }

  return sendSuccess(res, 'Login successful', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar: user.avatar
    },
    profile,
    accessToken,
    refreshToken
  });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 'Not authenticated', 401);
  }

  let profile = null;
  if (req.user.role === 'student') {
    profile = await StudentProfile.findOne({ user: req.user._id }).populate('mentor', 'name email department avatar');
  }

  return sendSuccess(res, 'Current user retrieved', {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      department: req.user.department,
      avatar: req.user.avatar
    },
    profile
  });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    await AuditLog.create({
      user: req.user._id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'USER_LOGOUT',
      entity: 'User',
      entityId: req.user._id.toString()
    });
  }
  return sendSuccess(res, 'Logged out successfully');
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return sendError(res, 'Email is required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    // Return success to prevent email enumeration
    return sendSuccess(res, 'If your email is registered, you will receive a reset password link shortly.');
  }

  return sendSuccess(res, 'Password reset instructions sent to your registered email address.');
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return sendError(res, 'Current and new password are required', 400);
  }
  
  if (!req.user) {
    return sendError(res, 'Not authenticated', 401);
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return sendError(res, 'Incorrect current password', 400);
  }

  user.password = newPassword;
  await user.save();

  await AuditLog.create({
    user: req.user._id,
    userEmail: req.user.email,
    userRole: req.user.role,
    action: 'USER_PASSWORD_CHANGED',
    entity: 'User',
    entityId: req.user._id.toString()
  });

  return sendSuccess(res, 'Password updated successfully');
});
