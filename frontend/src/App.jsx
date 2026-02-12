import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { Analytics } from "@vercel/analytics/react"
import JobCard from './components/JobCard';
import JobDetail from './components/JobDetail';

import JobLlamaLogo from './assets/jobllama.jpg';

import API_URL from './utils/api';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/jobs`);
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to fetch jobs. Please try again later.");
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen font-sans bg-[#fdfbf7]">
      <Analytics />
      <header className="bg-white border-b-4 border-black sticky top-0 z-40">
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 text-4xl font-black text-black tracking-tighter italic no-underline group">
            <img src={JobLlamaLogo} alt="JobLlama Logo" className="h-16 w-16 object-cover border-4 border-black shadow-[4px_4px_0_0_#ff6b00] group-hover:shadow-[6px_6px_0_0_#ff6b00] transition-shadow" />
            <span className="shadow-[2px_2px_0_0_#ff6b00]">
              JOB<span className="text-orange-600">LLAMA</span>
            </span>
          </Link>
          <div className="text-sm font-bold bg-black text-white px-4 py-2 transform -rotate-2">
            GET YOUR FIRST JOB
          </div>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center mb-8">
             <div className="h-4 w-4 bg-orange-600 mr-2 border border-black"></div>
             <h2 className="text-2xl font-bold text-black uppercase tracking-widest">Latest Opportunities</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-12 w-12 border-4 border-black border-t-orange-600 rounded-full"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-4 border-black text-black p-6 shadow-[4px_4px_0_0_#000]" role="alert">
              <p className="font-black text-xl mb-2">ERROR</p>
              <p className="font-medium">{error}</p>
            </div>
          ) : (
            <JobList jobs={jobs} />
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/job/:id" element={<JobDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
