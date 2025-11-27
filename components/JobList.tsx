import React, { useState } from 'react';
import { JobPosting } from '../types';
import { MapPin, Building2, Briefcase, Clock, Search, SlidersHorizontal, CheckCircle, X } from 'lucide-react';

interface JobListProps {
  jobs: JobPosting[];
  onApply: (job: JobPosting, coverLetter: string) => void;
}

export const JobList: React.FC<JobListProps> = ({ jobs, onApply }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [applyingJob, setApplyingJob] = useState<JobPosting | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyClick = (job: JobPosting) => {
    setApplyingJob(job);
    setCoverLetter('');
  };

  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyingJob) {
      onApply(applyingJob, coverLetter);
      setApplyingJob(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-24 right-6 z-50 bg-green-50 text-green-700 px-6 py-4 rounded-xl shadow-lg border border-green-200 flex items-center gap-3 animate-fade-in">
          <CheckCircle size={24} />
          <div>
            <h4 className="font-bold">Application Sent!</h4>
            <p className="text-sm opacity-90">Good luck with your application.</p>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyingJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Apply for {applyingJob.title}</h3>
                <p className="text-sm text-gray-500">at {applyingJob.company}</p>
              </div>
              <button 
                onClick={() => setApplyingJob(null)}
                className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submitApplication} className="p-6 space-y-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">Resume / CV</label>
                 <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <p className="text-indigo-600 font-medium text-sm">Upload your resume</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOCX up to 5MB</p>
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">Cover Letter</label>
                 <textarea 
                   required
                   value={coverLetter}
                   onChange={(e) => setCoverLetter(e.target.value)}
                   rows={6}
                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                   placeholder="Introduce yourself and explain why you're a good fit..."
                 />
               </div>
               <div className="pt-2 flex gap-3">
                 <button 
                   type="button"
                   onClick={() => setApplyingJob(null)}
                   className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                 >
                   Submit Application
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Career Opportunities</h2>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search jobs, companies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="text-gray-400 mb-4">
            <Briefcase size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900">No jobs posted</h3>
          <p className="text-gray-500 mt-2">Be the first to post a new career opportunity.</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-300 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
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
                      {job.salaryRange}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-3xl">
                    {job.description}
                  </p>
                </div>
                
                <div className="flex flex-col gap-3 min-w-[140px]">
                  <button 
                    onClick={() => handleApplyClick(job)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                  >
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
      )}
    </div>
  );
};