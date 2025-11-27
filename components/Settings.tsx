
import React, { useState } from 'react';
import { Bell, Lock, User, Eye, CreditCard, HelpCircle, ChevronRight, Moon, Globe } from 'lucide-react';

export const Settings: React.FC = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-2">Manage your account preferences and configuration.</p>
      </header>

      <div className="space-y-6">
        {/* Account Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
             <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <User size={18} className="text-indigo-600" /> Account
             </h2>
          </div>
          <div className="divide-y divide-gray-100">
             <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
                <div>
                   <p className="font-medium text-gray-900">Personal Information</p>
                   <p className="text-sm text-gray-500">Update your name, email, and phone</p>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
             </button>
             <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
                <div>
                   <p className="font-medium text-gray-900">Password & Security</p>
                   <p className="text-sm text-gray-500">Change password and 2FA settings</p>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
             </button>
             <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
                <div>
                   <p className="font-medium text-gray-900">Billing & Payments</p>
                   <p className="text-sm text-gray-500">Manage cards and billing history</p>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
             </button>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
             <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-violet-600" /> Preferences
             </h2>
          </div>
          <div className="divide-y divide-gray-100">
             <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Bell size={20} />
                   </div>
                   <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates about your listings</p>
                   </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
             </div>

             <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                      <Moon size={20} />
                   </div>
                   <div>
                      <p className="font-medium text-gray-900">Dark Mode</p>
                      <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                   </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
             </div>
             
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <Eye size={20} />
                   </div>
                   <div>
                      <p className="font-medium text-gray-900">Public Profile</p>
                      <p className="text-sm text-gray-500">Allow others to see your profile</p>
                   </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={publicProfile} onChange={() => setPublicProfile(!publicProfile)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
             </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4">
           <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
           </button>
           <button className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
              Save Changes
           </button>
        </div>
      </div>
    </div>
  );
};

// Helper icon import for the component code
import { SlidersHorizontal } from 'lucide-react';
