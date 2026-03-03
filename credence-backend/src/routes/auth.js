const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log(`Registering user: ${email}, role: ${role}`);
    try {
        let user = await User.findOne({ email });
        if (user) {
            console.log(`User already exists: ${email}`);
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password, role });
        await user.save();
        console.log(`User saved: ${user._id}`);

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('REGISTRATION ERROR:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get Stats
router.get('/stats', require('../middleware/auth').auth, async (req, res) => {
    console.log(`FETCHING STATS FOR USER: ${req.user.id}`);
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            console.error('User not found in /stats');
            return res.status(404).json({ msg: 'User not found' });
        }

        // Calculate Rank
        const totalUsers = await User.countDocuments({ role: 'job-seeker' });
        const higherScoredUsers = await User.countDocuments({
            role: 'job-seeker',
            credenceScore: { $gt: user.credenceScore }
        });
        const rank = higherScoredUsers + 1;

        // Calculate Levels Cleared
        const Attempt = require('../models/Attempt');
        const userAttempts = await Attempt.find({ user: user._id });
        let totalLevelsCleared = 0;
        let totalReasoningScore = 0;
        let totalReasoningCount = 0;

        userAttempts.forEach(attempt => {
            if (attempt.levelResults) {
                attempt.levelResults.forEach(result => {
                    if (result.status === 'completed') {
                        totalLevelsCleared++;
                        totalReasoningScore += (result.explanationScore || 0);
                        totalReasoningCount++;
                    }
                });
            }
        });

        const avgReasoning = totalReasoningCount > 0
            ? Math.round((totalReasoningScore / (totalReasoningCount * 40)) * 100)
            : 0;

        console.log(`Stats calculated: Rank ${rank}, Score ${user.credenceScore}, Levels ${totalLevelsCleared}`);
        res.json({
            credenceScore: user.credenceScore,
            rank,
            totalUsers,
            levelsCleared: totalLevelsCleared,
            reasoningScore: avgReasoning
        });
    } catch (err) {
        console.error('STATS ERROR TRACE:', err);
        res.status(500).json({ msg: 'Server error in stats calculation', error: err.message });
    }
});

// Get Leaderboard
router.get('/leaderboard', require('../middleware/auth').auth, async (req, res) => {
    try {
        const topUsers = await User.find({ role: 'job-seeker' })
            .sort({ credenceScore: -1 })
            .limit(10)
            .select('name credenceScore');

        const rankings = topUsers.map(u => ({
            name: u.name,
            score: u.credenceScore,
            consistency: u.credenceScore > 500 ? 'High' : (u.credenceScore > 100 ? 'Medium' : 'Initial')
        }));

        res.json(rankings);
    } catch (err) {
        console.error('LEADERBOARD ERROR:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
