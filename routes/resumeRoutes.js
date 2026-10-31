import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
    uploadResume,
    getResumeHistory,
    deleteResume,
    matchResume
} from "../controllers/resumeController.js";

const router = express.Router();

router.post(
    "/upload",
    protect,
    upload.single("resume"),
    uploadResume
);

router.get(
    "/history",
    protect,
    getResumeHistory
);

router.delete(
    "/:id",
    protect,
    deleteResume
);

router.post(
    "/match",
    protect,
    matchResume
);

export default router;