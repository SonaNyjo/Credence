const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String }, // For Lucide icon names
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Topic', topicSchema);
