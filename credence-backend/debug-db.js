const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Topic = require('./src/models/Topic');

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const topics = await Topic.find({});
        console.log('CURRENT TOPICS IN DB:', JSON.stringify(topics, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
