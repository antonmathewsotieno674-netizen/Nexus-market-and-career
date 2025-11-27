import React, { useState } from 'react';
import { JobPosting } from '../types';
import { generateJobDescription } from '../services/geminiService';
import { Sparkles, Loader2 } from 'lucide-react';

interface CreateJobProps {
  onCancel: () => void;
  onSubmit: (job: JobPosting) => void;
}

export const CreateJob: React.FC<CreateJobProps> = ({ onCancel, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salaryRange: '',
    type: 'Full-time' as const,
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAIGenerate = async () => {
    if (!formData.title || !formData.company) {
      alert("Please fill in Job Title and Company first.");
      return;
    }
    setGenerating(true);
    const desc = await generateJobDescription(formData.title, formData.company);
    setFormData(prev => ({ ...prev, description: desc }));
    setGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network
    setTimeout(() => {
      const newJob: JobPosting = {
        id: Date.now().toString(),
        ...formData,
        createdAt: Date.now()
      };
      onSubmit(newJob);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Post a Job</h2>
        <p className="text-gray-500">Find the perfect candidate for your open role.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Job Title</label>
            <input 
              required
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              placeholder="e.g. Senior React Developer"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Company Name</label>
            <input 
              required
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              placeholder="e.g. TechCorp Inc."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <input 
              required
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              placeholder="e.g. Remote / New York, NY"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Salary Range</label>
            <input 
              required
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              placeholder="e.g. 100k - 140k"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Employment Type</label>
           <select 
            required
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        <div className="space-y-2 relative">
           <div className="flex justify-between items-center">
             <label className="text-sm font-medium text-gray-700">Job Description</label>
             <button 
               type="button"
               onClick={handleAIGenerate}
               disabled={generating}
               className="text-xs flex items-center gap-1.5 text-indigo-600 font-medium hover:text-indigo-700 disabled:opacity-50"
             >
                {generating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                {generating ? 'Generating...' : 'Enhance with AI'}
             </button>
          </div>
          <textarea 
            required
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
            placeholder="Describe the role, responsibilities, and perks..."
          />
        </div>

         <div className="flex gap-4 pt-4 border-t border-gray-100">
           <button 
             type="button" 
             onClick={onCancel}
             className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
           >
             Cancel
           </button>
           <button 
             type="submit" 
             disabled={loading}
             className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
           >
             {loading && <Loader2 size={18} className="animate-spin" />}
             Post Opportunity
           </button>
        </div>
      </form>
    </div>
  );
};
