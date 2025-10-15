import express from 'express';
import {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createAppointment)
  .get(protect, getUserAppointments);

router.route('/:id')
  .get(protect, getAppointmentById)
  .delete(protect, cancelAppointment);

router.patch('/:id/status', protect, updateAppointmentStatus);

export default router;
