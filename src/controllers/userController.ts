import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in environment variables");
}

const JWT_SECRET = process.env.JWT_SECRET;

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: "User with this email already exists",
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    // Create JWT token
    const token = jwt.sign({ userId: savedUser._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
        },
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
      return;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
      return;
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    });
  }
};

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: "Invalid user ID format",
      });
      return;
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching the user",
    });
  }
};
