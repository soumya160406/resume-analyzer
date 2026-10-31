import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
    register,
    login,
    forgotPassword,
    resetPassword,
    googleLogin
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/google", googleLogin);

router.get("/profile", protect, (req, res) => {
    res.json(req.user);
});

export default router;