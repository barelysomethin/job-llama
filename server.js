import express from "express";
import cors from "cors";
import db, { Job } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to Database
// db(); // Removed global call

// Get all jobs
app.get("/api/jobs", async (req, res) => {
  try {
    await db(); // Ensure DB is connected
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get job by ID
app.get("/api/jobs/:id", async (req, res) => {
  try {
    await db(); // Ensure DB is connected
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the Express API for Vercel
export default app;
