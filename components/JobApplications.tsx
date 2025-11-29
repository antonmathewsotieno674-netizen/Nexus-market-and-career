import React, { useState, useMemo } from 'react';
import { JobApplication } from '../types';
import { Briefcase, CheckCircle, XCircle, Clock, User, Building2, ChevronDown, Search, Filter, ArrowUpDown } from 'lucide-react';

interface JobApplicationsProps {
  applications: JobApplication[];
  isEmployer?: boolean; // Toggle between "My Applications" and "Received Applications" view
  onStatusUpdate?: (id: string, newStatus: JobApplication['status']) => void;
}

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';
type StatusFilter = 'All' | 'Pending' | 'Reviewed' | 'Interview' | 'Rejected';

export const JobApplications: React.FC<JobApplicationsProps> = ({ applications, isEmployer = false, onStatusUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reviewed': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Interview': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    }
  };

  const handleStatusChange = (id: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onStatusUpdate) {
      onStatusUpdate(id, e.target.value as JobApplication['status']);
    }
  };

  const filteredAndSortedApplications = useMemo(() => {
    let result = [...applications];

    // 1. Search Filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(app => 
        (isEmployer ? app.applicantName : app.jobTitle).toLowerCase().includes(lowerTerm) ||
        (isEmployer ? app.email : app.company).toLowerCase().includes(lowerTerm)
      );
    }

    // 2. Status Filter
    if (statusFilter !== 'All') {
      result = result.filter(app => app.status === statusFilter);
    }

    // 3. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return a.appliedAt - b.appliedAt;
        case 'date-desc':
          return b.appliedAt - a.appliedAt;
        case 'title-asc': {
           const titleA = isEmployer ? a.applicantName : a.jobTitle;
           const titleB = isEmployer ? b.applicantName : b.jobTitle;
           return titleA.localeCompare(titleB);
        }
        case 'title-desc': {
           const titleC = isEmployer ? a.applicantName : a.jobTitle;
           const titleD = isEmployer ? b.applicantName : b.jobTitle;
           return titleD.localeCompare(titleC);
        }
        default:
          return 0;
      }
    });

    return result;
  }, [applications, searchTerm, statusFilter, sortBy, isEmployer]);

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">
             {isEmployer ? 'Candidate Management' : 'My Applications'}
           </h1>
           <p className="text-gray-500 mt-1">
             {isEmployer 
               ? 'Review and manage incoming job applications.' 
               : 'Track the status of your current job applications.'}
           </p>
        </div>
      </header>

      {/* Filter & Sort Controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={isEmployer ? "Search candidates, email..." : "Search jobs, companies..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
            />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative min-w-[140px] flex-1 md:flex-none">
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl appearance-none text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Interview">Interview</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative min-w-[160px] flex-1 md:flex-none">
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl appearance-none text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="title-asc">Name (A-Z)</option>
                    <option value="title-desc">Name (Z-A)</option>
                </select>
                <ArrowUpDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="text-gray-400 mb-4">
            <Briefcase size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900">No applications found</h3>
          <p className="text-gray-500 mt-2">
            {isEmployer 
              ? 'You haven\'t received any applications yet.' 
              : 'You haven\'t applied to any jobs yet.'}
          </p>
        </div>
      ) : filteredAndSortedApplications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
             <div className="text-gray-300 mb-3">
               <Search size={32} className="mx-auto" />
             </div>
             <p className="text-gray-500 font-medium">No applications match your filters.</p>
             <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                className="mt-2 text-indigo-600 text-sm font-medium hover:underline"
             >
                Clear Filters
             </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {isEmployer ? 'Candidate' : 'Role / Company'}
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    {isEmployer ? 'Update Status' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAndSortedApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      {isEmployer ? (
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                             {app.applicantName.charAt(0)}
                           </div>
                           <div>
                             <p className="font-medium text-gray-900">{app.applicantName}</p>
                             <p className="text-xs text-gray-500">{app.email}</p>
                             <p className="text-xs text-gray-400 mt-0.5">Applied for: {app.jobTitle}</p>
                           </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
                             <Building2 size={20} />
                           </div>
                           <div>
                             <p className="font-medium text-gray-900">{app.jobTitle}</p>
                             <p className="text-sm text-gray-500">{app.company}</p>
                           </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={14} className="mr-1.5" />
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEmployer ? (
                         <div className="flex items-center justify-end gap-2">
                            <div className="relative group">
                              <select 
                                value={app.status}
                                onChange={(e) => handleStatusChange(app.id, e)}
                                className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-colors"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Interview">Interview</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                         </div>
                      ) : (
                        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
             <span>Showing {filteredAndSortedApplications.length} of {applications.length} applications</span>
          </div>
        </div>
      )}
    </div>
  );
};