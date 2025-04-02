const mongoose = require("mongoose");

//!pass: iwPsMFOkM54s0zWY
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://ksakshi2101:3hIAN1SfNgrOoEMz@sakshi-ai.p55jqlw.mongodb.net/sakshi-ai?retryWrites=true&w=majority"
    );
    console.log(`Mongodb connected ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB ${error.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;
