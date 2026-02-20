import fs from 'fs';
import db, { Job } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const SITE_URL = process.env.SITE_URL || 'https://job-llama.vercel.app';

async function getTweet() {
    console.log("Connecting to DB...");
    await db();

    // Find one job from the last 24 hours that hasn't been tweeted
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const job = await Job.findOne({
        createdAt: { $gte: oneDayAgo },
        istweeted: { $ne: true }
    });

    if (!job) {
        console.log("\n❌ No new jobs found to tweet right now.");
        process.exit(0);
    }

    // Replicate frontend slug logic
    const slug = `${job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${job._id}`;
    const jobUrl = `${SITE_URL}/job/${slug}`;
    const tweetText = `🚨 New Opportunity!\n\n${job.title}\n💰 Salary: ${job.salary || 'Not listed'}\n📍 Exp: ${job.experience}\n\nApply here: ${jobUrl}\n\n#Jobs #Hiring #Career`;

    console.log("\n========================================");
    console.log("🚀 READY TO TWEET! (Copy the text below)");
    console.log("========================================\n");
    console.log(tweetText);
    console.log("\n========================================\n");

    // Save to file as backup
    fs.writeFileSync('tweet_content.txt', tweetText);
    console.log("💾 Also saved to: tweet_content.txt");

    // Update DB so we don't pick this same job again
    job.istweeted = true;
    await job.save();
    console.log("✅ Marked job as 'tweeted' in database.");

    process.exit(0);
}

getTweet().catch(err => {
    console.error("Error generating tweet:", err);
    process.exit(1);
});
