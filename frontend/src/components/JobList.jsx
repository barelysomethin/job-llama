import React from 'react';
import JobCard from './JobCard';

const JobList = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-20 bg-white border-4 border-black shadow-[8px_8px_0_0_#000]">
        <p className="text-black text-2xl font-bold">NO JOBS FOUND.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
