// const mongoose = require('mongoose');

// mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => console.log('Connected to MongoDB'));

const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error("error while connecting the db",error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
