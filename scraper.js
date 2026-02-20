import fs from "fs";
import FetchJobPosts from "./apicall.js";
import db, { Job as Jobmodel } from "./db.js";
//apicalling/////////

let jobs = [];

const uid = (() => {
  let id = 0;
  return () => ++id;
})();

async function apicall() {
  jobs.push(...(await FetchJobPosts()));
  return jobs;
}
////filtering jobs for current date and formatting them for DB/////

async function filterjobs() {
  const jobs = await apicall();

  const filteredjobs = jobs.filter((job) => {
    return job.createdAt.includes(new Date().getDate()); //filtering jobs of current date
  });

  ///filtering jobs for db schema and adding and renaming and removing fields

  const jobsforDB = filteredjobs.map((job) => {
    const {
      title,
      body,
      salary,
      createdAt,
      experience,
      jobTypeReference,
      apply,
    } = job;
    return {
      id: uid(),
      title: title,
      bodyhtml: body.html,
      salary: salary,
      createdAt: createdAt,
      experience: experience.experience,
      jobType: jobTypeReference.jobType,
      apply: apply,
      istweeted: false,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
  });

  //  console.log("jobs formatted for DB", jobsforDB);

  return jobsforDB;
}

/////saving jobs in the database/////

export async function savejobs() {
  await db();
  const jobsforDB = await filterjobs();

  if (jobsforDB.length === 0) {
    console.log("No new jobs to save.");
    return { message: "No new jobs found" };
  }

  let result = await Jobmodel.insertMany(jobsforDB);
  
  // Update each job with its permanent slug (title-slug + mongoId)
  for (let job of result) {
    job.slug = `${job.slug}-${job._id}`;
    await job.save();
  }

  console.log("jobs saved to DB with permanent slugs", result.length);
  return result;
}
