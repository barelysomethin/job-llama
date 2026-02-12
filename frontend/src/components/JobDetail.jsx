import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import parseHtml from '../utils/htmlParser';

import API_URL from '../utils/api';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // Extract the ID from the slug (it's the last part after the last hyphen)
        const jobId = id.split('-').pop();
        const response = await axios.get(`${API_URL}/jobs/${jobId}`);
        setJob(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to fetch job details.");
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[#fdfbf7]">
      <div className="animate-spin h-12 w-12 border-4 border-black border-t-orange-600 rounded-full"></div>
    </div>
  );

  if (error || !job) return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col justify-center items-center p-4">
      <div className="bg-red-100 border-4 border-black text-black p-6 shadow-[4px_4px_0_0_#000] mb-6">
        <p className="font-black text-xl mb-2">ERROR</p>
        <p className="font-medium">{error || "Job not found"}</p>
      </div>
      <Link to="/" className="neo-button py-2 px-6 no-underline">Back to Jobs</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-block mb-6 font-bold text-black hover:text-orange-600 transition-colors">
          ← BACK TO JOBS
        </Link>
        
        <div className="neo-box w-full flex flex-col relative overflow-hidden ring-4 ring-black bg-white">
          {/* Header */}
          <div className="p-6 border-b-4 border-black flex justify-between items-start bg-orange-200 mobile:flex-col">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-black mb-4 uppercase tracking-tighter leading-none">{job.title}</h1>
              <div className="flex flex-wrap gap-3 text-sm font-bold">
                <span className="bg-black text-white px-3 py-1 border-2 border-transparent shadow shadow-black">{job.jobType}</span>
                <span className="bg-white text-black px-3 py-1 border-2 border-black">Salary: {job.salary || 'Not listed'}</span>
                <span className="bg-white text-black px-3 py-1 border-2 border-black">Exp: {job.experience}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
               <span className="text-xs font-bold uppercase tracking-widest border border-black px-2 py-1 bg-white">
                 Posted: {new Date(job.createdAt).toLocaleDateString()}
               </span>
            </div>
          </div>

          {/* content */}
          <div className="p-8 bg-white">
             <div className="prose max-w-none prose-p:text-black prose-headings:text-black font-medium text-lg">
               {parseHtml(job.bodyhtml)}
             </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t-4 border-black bg-white flex justify-end sticky bottom-0">
            <a 
              href={job.apply} 
              target="_blank" 
              rel="noopener noreferrer"
              className="neo-button py-4 px-10 text-xl w-full md:w-auto text-center"
            >
              Apply Now ➔
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
