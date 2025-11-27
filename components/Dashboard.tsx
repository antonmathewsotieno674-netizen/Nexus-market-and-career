import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Product, JobPosting } from '../types';
import { TrendingUp, Users, DollarSign, Package, Briefcase, ArrowRight, Star } from 'lucide-react';

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome back to your activity hub.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Package size={24} />
            </div>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Active Products</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</h3>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400">
              <Briefcase size={24} />
            </div>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">+5%</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Open Positions</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</h3>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-pink-50 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Inventory Value</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">KSh {totalValue.toLocaleString()}</h3>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total Views</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">24.5k</h3>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Featured Products</h3>
          <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group transition-colors">
            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="flex gap-5 overflow-x-auto pb-6 -mx-6 px-6 scrollbar-hide snap-x md:snap-none">
          {products.slice(0, 4).map((product) => (
            <div 
              key={product.id} 
              className="min-w-[280px] md:min-w-[300px] bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 group cursor-pointer snap-center relative"
            >
              <div className="aspect-[4/3] rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden mb-3 relative">
                 {product.imageUrls?.[0] ? (
                   <img 
                      src={product.imageUrls[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                      <Package size={32} />
                   </div>
                 )}
                 {product.rating && (
                   <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 text-gray-900 dark:text-white">
                     {product.rating} <Star size={10} className="fill-amber-400 text-amber-400" />
                   </div>
                 )}
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>
              
              <div className="px-1 space-y-1.5">
                <h4 className="font-bold text-gray-900 dark:text-white truncate text-lg" title={product.name}>{product.name}</h4>
                <div className="flex items-center justify-between">
                   <span className="text-indigo-600 dark:text-indigo-400 font-bold">KSh {product.price.toLocaleString()}</span>
                   <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full capitalize">
                      {product.category}
                   </span>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
             <div className="w-full py-12 text-center text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                <Package size={32} className="mx-auto mb-2 opacity-50" />
                <p>No featured products available</p>
             </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Platform Activity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
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

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-center transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-4">
                <button className="w-full p-4 text-left border border-indigo-100 dark:border-indigo-900/30 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group">
                    <h4 className="font-medium text-indigo-900 dark:text-indigo-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-200">Promote Listings</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Boost your top performing products to reach more customers.</p>
                </button>
                <button className="w-full p-4 text-left border border-violet-100 dark:border-violet-900/30 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors group">
                    <h4 className="font-medium text-violet-900 dark:text-violet-300 group-hover:text-violet-700 dark:group-hover:text-violet-200">Review Applications</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">You have 12 new candidates waiting for review.</p>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};