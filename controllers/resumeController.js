import Resume from "../models/Resume.js";
import { extractPdfText } from "../utils/extractPdfText.js";
import { analyzeResume, matchResumeWithJob } from "../utils/gemini.js";
import fs from "fs";

export const uploadResume = async (req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }

        // Extract text from PDF
        const extractedText = await extractPdfText(req.file.path);

        // Send to Gemin
        const analysisText = await analyzeResume(extractedText);

        // Remove markdown if Gemini returns ```json ... ```
        const cleaned = analysisText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let analysis;

        try {
            analysis = JSON.parse(cleaned);
        } catch (err) {
            analysis = {
                rawResponse: cleaned,
            };
        }

        // Save to MongoDB
        const resume = await Resume.create({
            user: req.user._id,
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: req.file.path,
            extractedText,
            analysis,
        });

        res.status(201).json({
            message: "Resume analyzed successfully",
            resume,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message,
        });
    }
};

export const getResumeHistory = async (req, res) => {
    try {

        const resumes = await Resume.find({
            user: req.user._id,
        })
        .sort({ createdAt: -1 });

        res.json(resumes);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

export const deleteResume = async (req, res) => {
    try {

        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        // Delete PDF from uploads folder
        if (fs.existsSync(resume.filePath)) {
            fs.unlinkSync(resume.filePath);
        }

        // Delete from MongoDB
        await Resume.findByIdAndDelete(req.params.id);

        res.json({
            message: "Resume deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const matchResume = async (req, res) => {

    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    try {

        const { resumeText, jobDescription } = req.body;

        const result = await matchResumeWithJob(
            resumeText,
            jobDescription
        );

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message
        });

    }

};