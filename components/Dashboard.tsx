import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Product, JobPosting } from '../types';
import { TrendingUp, Users, DollarSign, Package, Briefcase } from 'lucide-react';

interface DashboardProps {
  products: Product[];
  jobs: JobPosting[];
}

export const Dashboard: React.FC<DashboardProps> = ({ products, jobs }) => {
  const totalValue = products.reduce((acc, curr) => acc + curr.price, 0);
  
  // Mock data for the chart based on current inventory
  const data = [
    { name: 'Products', count: products.length },
    { name: 'Jobs', count: jobs.length },
    { name: 'Views (k)', count: Math.floor(Math.random() * 20) + 5 },
    { name: 'Sales', count: Math.floor(products.length * 0.4) },
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'];

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back to your activity hub.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <Package size={24} />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-gray-500 text-sm">Active Products</p>
          <h3 className="text-2xl font-bold text-gray-900">{products.length}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-violet-50 rounded-lg text-violet-600">
              <Briefcase size={24} />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+5%</span>
          </div>
          <p className="text-gray-500 text-sm">Open Positions</p>
          <h3 className="text-2xl font-bold text-gray-900">{jobs.length}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-pink-50 rounded-lg text-pink-600">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm">Inventory Value</p>
          <h3 className="text-2xl font-bold text-gray-900">KSh {totalValue.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm">Total Views</p>
          <h3 className="text-2xl font-bold text-gray-900">24.5k</h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Activity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-4">
                <button className="w-full p-4 text-left border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-colors group">
                    <h4 className="font-medium text-indigo-900 group-hover:text-indigo-700">Promote Listings</h4>
                    <p className="text-sm text-gray-500 mt-1">Boost your top performing products to reach more customers.</p>
                </button>
                <button className="w-full p-4 text-left border border-violet-100 rounded-xl hover:bg-violet-50 transition-colors group">
                    <h4 className="font-medium text-violet-900 group-hover:text-violet-700">Review Applications</h4>
                    <p className="text-sm text-gray-500 mt-1">You have 12 new candidates waiting for review.</p>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};