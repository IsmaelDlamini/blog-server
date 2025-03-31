import mongoose from "mongoose";

 const ConnectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_SECRET);
    console.log("Successfully connected to the database.");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

export default ConnectMongo;
