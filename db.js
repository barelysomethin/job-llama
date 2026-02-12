import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(".env", { quiet: true, debug: false });

const db = async () => {
  try {
    await mongoose.connect(process.env.mongo_url);
    console.log("connected to DB");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};


export default db;

const jobschema = new mongoose.Schema({
  id: Number,
  title: String,
  bodyhtml: String,
  salary: String,
  createdAt: Date,
  experience: String,
  jobType: String,
  apply: String,
  istweeted: Boolean
});

export const Job = mongoose.model("jobtables", jobschema);
