import React from 'react';
import { JobApplication } from '../types';
import { Briefcase, CheckCircle, XCircle, Clock, User, Building2 } from 'lucide-react';

interface JobApplicationsProps {
  applications: JobApplication[];
  isEmployer?: boolean; // Toggle between "My Applications" and "Received Applications" view
}

export const JobApplications: React.FC<JobApplicationsProps> = ({ applications, isEmployer = false }) => {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reviewed': return 'bg-blue-50 text-blue-700';
      case 'Interview': return 'bg-purple-50 text-purple-700';
      case 'Rejected': return 'bg-red-50 text-red-700';
      default: return 'bg-yellow-50 text-yellow-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 shadow-sm">
            Total: {applications.length}
          </div>
        </div>
      </header>

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
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
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
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEmployer ? (
                         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve / Interview">
                              <CheckCircle size={18} />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Reject">
                              <XCircle size={18} />
                            </button>
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
        </div>
      )}
    </div>
  );
};