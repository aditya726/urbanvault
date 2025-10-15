import express from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getUserNotifications)
  .delete(protect, deleteAllNotifications);

router.patch('/read-all', protect, markAllNotificationsAsRead);

router.route('/:id')
  .patch(protect, markNotificationAsRead)
  .delete(protect, deleteNotification);

// Alias for marking as read
router.patch('/:id/read', protect, markNotificationAsRead);

export default router;
