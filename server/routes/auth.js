import express from "express";
import { login, register } from "../controllers/auth.js";

const router = express.Router();

/* REGISTER */
router.post("/register", register);

router.post("/login", login);

// Login
export default router;
