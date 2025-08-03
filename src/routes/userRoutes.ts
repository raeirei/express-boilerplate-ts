import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  login,
} from "../controllers/userController";

const router = Router();

// Route to create a new user
router.post("/", createUser);

// Route to get all users
router.get("/", getUsers);

// Route to get a specific user by ID
router.get("/:id", getUserById);

// Route to login a user
router.post("/login", login);

export default router;
