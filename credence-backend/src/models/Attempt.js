const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
    levelProgress: { type: Number, default: 1 }, // Current level being attempted (1-4)
    levelResults: [{
        levelNumber: { type: Number },
        explanation: { type: String },
        mcqScore: { type: Number },
        explanationScore: { type: Number },
        integrityFlags: {
            tabSwitches: { type: Number, default: 0 },
            isTerminated: { type: Boolean, default: false }
        },
        status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
        score: { type: Number, default: 0 }
    }],
    totalCredenceScore: { type: Number, default: 0 },
    status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
});

module.exports = mongoose.model('Attempt', attemptSchema);
