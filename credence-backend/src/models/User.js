const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['job-seeker', 'recruiter', 'admin'], default: 'job-seeker' },
    credenceScore: { type: Number, default: 0 },
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attempt' }],
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = crypto.createHash('sha256').update(this.password).digest('hex');
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = function (password) {
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    return hash === this.password;
};

module.exports = mongoose.model('User', userSchema);
