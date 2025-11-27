import React from 'react';
import { User, Mail, MapPin, Calendar, Camera, Briefcase } from 'lucide-react';

export const Profile: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-violet-500 relative">
          <button className="absolute bottom-4 right-4 bg-black/30 text-white p-2 rounded-full hover:bg-black/40 transition-colors">
            <Camera size={20} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-300 border-2 border-indigo-50">
                   <User size={64} />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors mb-2">
              Edit Profile
            </button>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">John Doe</h1>
            <p className="text-gray-500 font-medium">Product Designer & Entrepreneur</p>
            
            <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-indigo-500" />
                john.doe@example.com
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-indigo-500" />
                San Francisco, CA
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-indigo-500" />
                Joined March 2024
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-900 mb-4">Account Stats</h3>
             <div className="space-y-4">
               <div className="flex justify-between items-center py-2 border-b border-gray-50">
                 <span className="text-gray-500">Items Sold</span>
                 <span className="font-bold text-gray-900">124</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-gray-50">
                 <span className="text-gray-500">Active Listings</span>
                 <span className="font-bold text-gray-900">8</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-gray-50">
                 <span className="text-gray-500">Jobs Posted</span>
                 <span className="font-bold text-gray-900">2</span>
               </div>
               <div className="flex justify-between items-center py-2">
                 <span className="text-gray-500">Rating</span>
                 <span className="font-bold text-green-600">4.9/5.0</span>
               </div>
             </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Bio</h3>
            <p className="text-gray-600 leading-relaxed">
              Passionate about creating minimal and functional products. I've been selling on Nexus Market since its inception. I also run a small design studio looking for fresh talent.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Recent Activity</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-700">View All</button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 items-start pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <span className="font-bold">K</span>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Sold "Vintage Camera"</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <span className="ml-auto font-bold text-gray-900">+KSh 12,000.00</span>
              </div>
              <div className="flex gap-4 items-start pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Briefcase size={18} />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">New Applicant for "Frontend Dev"</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};