const express = require('express');
const router = express.Router();
const Attempt = require('../models/Attempt');
const Assessment = require('../models/Assessment');
const { auth } = require('../middleware/auth');

// Helper for conceptual scoring (keyword matching)
const calculateExplanationScore = (explanation, rubric) => {
    if (!explanation) return 0;
    const lowerExp = explanation.toLowerCase();
    let score = 0;

    // Core Concepts (20%)
    let coreMatches = 0;
    rubric.coreConcepts.forEach(concept => {
        if (lowerExp.includes(concept.toLowerCase())) coreMatches++;
    });
    if (coreMatches > 0) score += 20;

    // Reasoning Concepts (20%)
    let reasoningMatches = 0;
    rubric.reasoningConcepts.forEach(concept => {
        if (lowerExp.includes(concept.toLowerCase())) reasoningMatches++;
    });
    if (reasoningMatches > 0) score += 20;

    return score;
};

// Start or Get existing Attempt for a Problem
router.post('/start/:problemId', auth, async (req, res) => {
    try {
        let attempt = await Attempt.findOne({ user: req.user.id, assessment: req.params.problemId });
        if (!attempt) {
            attempt = new Attempt({
                user: req.user.id,
                assessment: req.params.problemId,
                levelProgress: 1
            });
            await attempt.save();
        }
        res.json(attempt);
    } catch (err) {
        console.error('START ATTEMPT ERROR:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Submit Level Result (Explanation + MCQs)
router.post('/:problemId/submit-level', auth, async (req, res) => {
    const { levelNumber, explanation, mcqResponses } = req.body;
    try {
        const problem = await Assessment.findById(req.params.problemId);
        const attempt = await Attempt.findOne({ user: req.user.id, assessment: req.params.problemId });

        if (!problem || !attempt) return res.status(404).json({ msg: 'Problem or Attempt not found' });

        const levelData = problem.levels.find(l => l.levelNumber == levelNumber);

        // 1. Calculate MCQ Score (60% weight)
        let correctCount = 0;
        mcqResponses.forEach((resp, idx) => {
            if (resp.selectedOption === levelData.mcqs[idx].correctOption) correctCount++;
        });
        const mcqScore = (correctCount / 10) * 60;

        // 2. Calculate Explanation Score (40% weight)
        const explanationScore = calculateExplanationScore(explanation, levelData.rubric);

        const totalLevelScore = mcqScore + explanationScore;

        // 3. Update Attempt
        const resultIndex = attempt.levelResults.findIndex(r => r.levelNumber == levelNumber);
        const resultData = {
            levelNumber,
            explanation,
            mcqScore,
            explanationScore,
            score: totalLevelScore,
            status: 'completed'
        };

        if (resultIndex > -1) {
            attempt.levelResults[resultIndex] = resultData;
        } else {
            attempt.levelResults.push(resultData);
        }

        // Unlock next level
        if (attempt.levelProgress === levelNumber && levelNumber < 4) {
            attempt.levelProgress = levelNumber + 1;
        }

        // Update Total Credence Score
        attempt.totalCredenceScore = attempt.levelResults.reduce((acc, curr) => acc + curr.score, 0);

        if (levelNumber === 4) attempt.status = 'completed';

        await attempt.save();

        // 4. Update User Model for Global Stats
        const User = require('../models/User'); // Import here to avoid circular dependencies if any
        const user = await User.findById(req.user.id);
        if (user) {
            // Add attempt to history if not already there
            if (!user.history.includes(attempt._id)) {
                user.history.push(attempt._id);
            }

            // Recalculate total credence score from all completed attempts
            const allAttempts = await Attempt.find({ user: req.user.id, status: 'completed' });
            const totalScore = allAttempts.reduce((acc, curr) => acc + curr.totalCredenceScore, 0);
            user.credenceScore = totalScore;

            await user.save();
        }

        res.json({ attempt, currentLevelScore: totalLevelScore });
    } catch (err) {
        console.error('SUBMIT LEVEL ERROR:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;
