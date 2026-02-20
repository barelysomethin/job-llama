import puppeteer from 'puppeteer';
import db, { Job } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const SITE_URL = process.env.SITE_URL || 'https://job-llama.vercel.app';

async function postToTwitter() {
    console.log("Connecting to DB...");
    await db();

    // Find one job from today that hasn't been tweeted
    // We'll look for jobs created in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const job = await Job.findOne({
        createdAt: { $gte: oneDayAgo },
        istweeted: { $ne: true },
        slug: { $exists: true } // Only pick jobs that have the new slug stored
    });

    if (!job) {
        console.log("No new jobs with slugs found to tweet today.");
        process.exit(0);
    }

    console.log(`Found job: ${job.title}`);

    const jobUrl = `${SITE_URL}/job/${job.slug}`;
    const tweetText = `🚨 New Opportunity!\n\n${job.title}\n💰 Salary: ${job.salary || 'Not listed'}\n📍 Exp: ${job.experience}\n\nApply here: ${jobUrl}\n\n#Jobs #Hiring #Career`;

    console.log("Launching browser...");
    // Using a persistent user data directory to keep the Twitter login session
    const browser = await puppeteer.launch({
        headless: false, // Set to false to see it happen/login if needed
        userDataDir: './twitter_session',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        console.log("Navigating to Twitter...");
        await page.goto('https://x.com/compose/post', { waitUntil: 'networkidle2' });

        // Wait for the tweet text area
        // Twitter's selectors change, so we'll look for contenteditable
        console.log("Waiting for tweet box...");
        await page.waitForSelector('div[contenteditable="true"]', { timeout: 30000 });

        console.log("Typing tweet...");
        await page.click('div[contenteditable="true"]');
        await page.keyboard.type(tweetText);

        console.log("Clicking Post button...");
        // Look for the post button (often has data-testid="tweetButton")
        const postButtonSelector = '[data-testid="tweetButton"], [data-testid="tweetButtonInline"]';
        await page.waitForSelector(postButtonSelector);
        await page.click(postButtonSelector);

        console.log("Waiting for post to complete...");
        await new Promise(r => setTimeout(r, 5000)); // Wait for the animation

        // Update DB
        job.istweeted = true;
        await job.save();
        console.log("Job marked as tweeted in DB.");

    } catch (error) {
        console.error("Error during tweeting:", error);
    } finally {
        await browser.close();
        process.exit(0);
    }
}

postToTwitter();
