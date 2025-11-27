import React from 'react';
import { JobPosting } from '../types';
import { MapPin, Building2, Briefcase, Clock } from 'lucide-react';

interface JobListProps {
  jobs: JobPosting[];
}

export const JobList: React.FC<JobListProps> = ({ jobs }) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
        <div className="text-gray-400 mb-4">
          <Briefcase size={48} className="mx-auto" />
        </div>
        <h3 className="text-xl font-medium text-gray-900">No jobs posted</h3>
        <p className="text-gray-500 mt-2">Be the first to post a new career opportunity.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Career Opportunities</h2>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                   <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                   <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                     {job.type}
                   </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Building2 size={16} />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {job.location}
                  </div>
                   <div className="flex items-center gap-1 text-green-600 font-medium">
                    ${job.salaryRange}
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-3xl">
                  {job.description}
                </p>
              </div>
              
              <div className="flex flex-col gap-3 min-w-[140px]">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                  Apply Now
                </button>
                <div className="flex items-center justify-center text-xs text-gray-400">
                  <Clock size={12} className="mr-1" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
