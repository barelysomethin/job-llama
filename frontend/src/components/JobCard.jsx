import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const slug = job.slug;

  return (
    <Link 
      to={`/job/${slug}`}
      className="neo-box p-6 mb-4 cursor-pointer flex justify-between items-center group bg-white block no-underline hover:text-inherit"
    >
      <div>
        <h3 className="text-xl font-bold text-black mb-2 group-hover:text-orange-600 transition-colors uppercase tracking-tight">
          {job.title}
        </h3>
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          <span className="bg-black text-white px-3 py-1 border border-black">
            {job.jobType}
          </span>
          <span className="bg-orange-100 text-black px-3 py-1 border border-black">
            {job.experience}
          </span>
          <span className="text-gray-600 self-center">
             Posted {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="hidden sm:block">
         <span className="text-lg font-bold bg-yellow-300 px-4 py-2 border-2 border-black shadow-[2px_2px_0_0_#000]">
           {job.salary || 'Salary hidden'}
         </span>
      </div>
    </Link>
  );
};

export default JobCard;
