import { Router } from 'express';
import { createUser, getUsers, getUserById } from '../controllers/userController';

const router = Router();

// Route to create a new user
router.post('/', createUser);

// Route to get all users
router.get('/', getUsers);

// Route to get a specific user by ID
router.get('/:id', getUserById);

export default router;
