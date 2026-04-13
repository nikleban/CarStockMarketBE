import express from 'express';
import { registerUser, loginUser } from '#/controllers/User/userController.js';
import protect from '#/middlewares/AuthMiddleware.js';
import {
  sendVerificationCode,
  getUserWithToken,
  getUser,
  getUserCarListings,
  getUserLikedCarListings,
} from '#/controllers/User/userController.js';
import { logoutUser } from '#/controllers/User/userController.js';

const router = express.Router();

router.post('/sendVerificationCode', sendVerificationCode);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserWithToken);
router.post('/logout', protect, logoutUser);
router.get('/user/:id', protect, getUser);
router.get('/:id/carListings', protect, getUserCarListings);
router.get('/:id/likedCarListings', protect, getUserLikedCarListings);

export default router;
