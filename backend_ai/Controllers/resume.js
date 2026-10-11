
const ResumeModel = require('../Models/resume');
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

const addResume = async (req, res) => {
    try {
        const { job_desc, user } = req.body;

        const pdfPath = req.file.path;
        const dataBuffer = fs.readFileSync(pdfPath);
        const pdfData = await pdfParse(dataBuffer);

        const prompt = `
You are an AI resume screening assistant.

Return:
Score: (0-100)
Reason: explanation

Resume:
${pdfData.text}

Job Description:
${job_desc}
`;

        const response = await cohere.chat({
            model: "command-a-03-2025",
            message: prompt,
            temperature: 0.7,
        });

        const resultText = response.text;

        const scoreMatch = resultText.match(/Score:\s*(\d+)/i);
        const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

        const reasonMatch = resultText.match(/Reason:\s*([\s\S]*)/i);
        const reason = reasonMatch ? reasonMatch[1].trim() : "No feedback";

        const cleanReason = reason.replace(/^\*\*\s*/, "");

        const newResume = new ResumeModel({
            user,
            resume_name: req.file.originalname,
            job_desc,
            score,
            feedback: cleanReason
        });

        await newResume.save();
        fs.unlinkSync(pdfPath);

        res.status(200).json({
            message: "Analysis Ready",
            data: newResume
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const getAllResumesForUser = async (req, res) => {
    try {
        const { user } = req.params;
        const resumes = await ResumeModel.find({ user }).sort({ createdAt: -1 });
        res.status(200).json({ resumes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getResumeForAdmin = async (req, res) => {
    try {
        const resumes = await ResumeModel.find()
            .sort({ createdAt: -1 })
            .populate('user');

        res.status(200).json({ resumes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;

        await ResumeModel.findByIdAndDelete(id);

        res.status(200).json({
            message: "Resume deleted successfully",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    addResume,
    getAllResumesForUser,
    getResumeForAdmin,
    deleteResume
};