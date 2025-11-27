import mongoose from "mongoose";

const connectionDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.LINK_SERVER, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connected error", error.message);
  }
};

export default connectionDB;
