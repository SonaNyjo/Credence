const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    levels: [{
        levelNumber: { type: Number, required: true }, // 1 to 4
        difficulty: { type: String, enum: ['Easy', 'Medium', 'Medium-High', 'Hard'], required: true },
        programCode: { type: String, required: true },
        instruction: { type: String, default: "You are not required to write or fix code.\nYour task is to:\n- Understand how the system behaves\n- Identify the root cause of incorrect or risky behavior\n- Explain why this behavior occurs\nFocus on reasoning, not syntax." },
        explanationQuestion: { type: String, required: true }, // The specific reasoning task
        hint: { type: String },
        mcqs: [{
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctOption: { type: Number, required: true }
        }],
        rubric: {
            coreConcepts: [{ type: String }],
            reasoningConcepts: [{ type: String }]
        }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assessment', assessmentSchema);
