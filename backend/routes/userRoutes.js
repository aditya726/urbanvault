import express from 'express';
const router = express.Router();
import {
    registerUser,
    loginUser,
    getUserProfile
} from '../controllers/userController.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUserProfile);

export default router;