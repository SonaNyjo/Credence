const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const Assessment = require('../models/Assessment');
const { auth } = require('../middleware/auth');

// Get all Topics
router.get('/topics', auth, async (req, res) => {
    console.log('GET /api/assessments/topics - User:', req.user.id);
    try {
        const topics = await Topic.find({});
        console.log(`Found ${topics.length} topics`);
        res.json(topics);
    } catch (err) {
        console.error('GET TOPICS ERROR:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Get Problems by Topic
router.get('/topic/:topicId', auth, async (req, res) => {
    try {
        const assessments = await Assessment.find({ topic: req.params.topicId }, 'title description difficulty');
        res.json(assessments);
    } catch (err) {
        console.error('GET PROBLEMS ERROR:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Get Level details for a Problem
router.get('/:problemId/level/:levelNumber', auth, async (req, res) => {
    try {
        const problem = await Assessment.findById(req.params.problemId);
        if (!problem) return res.status(404).json({ msg: 'Problem not found' });

        const level = problem.levels.find(l => l.levelNumber == req.params.levelNumber);
        if (!level) return res.status(404).json({ msg: 'Level not found' });

        // Strip correct MCQ options if needed, but for now we'll send it all 
        // as the frontend needs to verify or we can verify on backend (better).
        // For now, simple return.
        res.json({
            title: problem.title,
            topicId: problem.topic,
            programCode: level.programCode, // Use level-specific code
            levelDetails: level
        });
    } catch (err) {
        console.error('GET LEVEL ERROR:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Debug catch-all for assessments
router.use((req, res) => {
    console.warn(`ASSESSMENT ROUTE NOT FOUND: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ msg: `Assessment route not found: ${req.originalUrl}` });
});

module.exports = router;
