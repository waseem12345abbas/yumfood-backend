require('dotenv').config();
const mongoose = require('mongoose');
const { DB_NAME} = require('../constants');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI || MONGO_URI}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
