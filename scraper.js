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
    };
  });

  //  console.log("jobs formatted for DB", jobsforDB);

  return jobsforDB;
}

/////saving jobs in the database/////

async function savejobs() {
  await db();
  const jobsforDB = await filterjobs();

  let result = await Jobmodel.insertMany(jobsforDB);
  console.log("jobs saved to DB", result);
}

savejobs();
