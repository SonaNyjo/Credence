const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Models
const Topic = require('./src/models/Topic');
const User = require('./src/models/User');
const Assessment = require('./src/models/Assessment');
const Attempt = require('./src/models/Attempt');

dotenv.config();

const dump = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const data = {
            topics: await Topic.find({}),
            users: await User.find({}),
            assessments: await Assessment.find({}),
            attempts: await Attempt.find({}),
        };

        console.log('---DUMP_START---');
        console.log(JSON.stringify(data, null, 2));
        console.log('---DUMP_END---');

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Error during dump:', err);
        process.exit(1);
    }
};

dump();
