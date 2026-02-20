import db, { Job } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

async function cleanup() {
    console.log("Connecting to DB...");
    await db();

    console.log("Removing 'slug' field from all jobs...");
    const result = await Job.updateMany({}, { $unset: { slug: "" } });
    
    console.log(`Successfully updated ${result.modifiedCount} jobs.`);
    process.exit(0);
}

cleanup().catch(err => {
    console.error("Cleanup failed:", err);
    process.exit(1);
});
