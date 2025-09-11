import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import properties from './data/properties.js';
import User from './models/User.js';
import Property from './models/Property.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
    try {
        // Clear existing data
        await Property.deleteMany();
        await User.deleteMany();

        // Insert users and get their IDs
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        // Add the admin user as the seller for all properties
        const sampleProperties = properties.map(property => {
            return { ...property, seller: adminUser };
        });

        await Property.insertMany(sampleProperties);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Property.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

// Check for command-line arguments to run the correct function
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}