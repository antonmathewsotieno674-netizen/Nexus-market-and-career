import React, { useState, useEffect } from 'react';
import { User as UserType, Product } from '../types';
import { wishlistService } from '../services/wishlistService';
import { User, Mail, MapPin, Calendar, Camera, Briefcase, Heart, Tag } from 'lucide-react';

interface ProfileProps {
  user?: UserType | null;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'wishlist'>('overview');
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    if (user && activeTab === 'wishlist') {
      const items = wishlistService.getWishlist(user.id);
      setWishlistItems(items);
    }
  }, [user, activeTab]);

  if (!user) return <div className="p-8 text-center text-gray-500">Please log in to view your profile.</div>;

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
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-300 border-2 border-indigo-50 font-bold text-4xl">
                   {user.avatar || <User size={64} />}
                </div>
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors mb-2">
              Edit Profile
            </button>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 font-medium">{user.bio || 'Member'}</p>
            
            <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-indigo-500" />
                {user.email}
              </div>
              {user.location && (
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-indigo-500" />
                    {user.location}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-indigo-500" />
                Joined March 2024
              </div>
            </div>
          </div>
        </div>
      
        {/* Profile Navigation Tabs */}
        <div className="px-8 flex gap-6 border-t border-gray-100">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('wishlist')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'wishlist' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
                <Heart size={16} /> Wishlist
            </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stats Column */}
            <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Account Stats</h3>
                <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-gray-500">Items Sold</span>
                    <span className="font-bold text-gray-900">0</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-gray-500">Active Listings</span>
                    <span className="font-bold text-gray-900">0</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-gray-500">Jobs Posted</span>
                    <span className="font-bold text-gray-900">0</span>
                </div>
                <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500">Rating</span>
                    <span className="font-bold text-gray-400">N/A</span>
                </div>
                </div>
            </div>
            </div>

            {/* Content Column */}
            <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Bio</h3>
                <p className="text-gray-600 leading-relaxed">
                    {user.bio || "No bio added yet."}
                </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Recent Activity</h3>
                </div>
                <p className="text-gray-500 text-sm">No recent activity to show.</p>
            </div>
            </div>
        </div>
      )}

      {activeTab === 'wishlist' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px]">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Heart className="text-red-500 fill-current" size={24} /> My Wishlist
              </h2>
              
              {wishlistItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                      <Heart size={48} className="mb-4 opacity-20" />
                      <p className="text-lg font-medium text-gray-500">Your wishlist is empty</p>
                      <p className="text-sm">Save items you love to find them easily later.</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map(product => (
                          <div key={product.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all group relative">
                               <div className="aspect-square bg-gray-50 relative">
                                  {product.imageUrls && product.imageUrls.length > 0 ? (
                                      <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                                          <Tag size={32} />
                                      </div>
                                  )}
                               </div>
                               <div className="p-4">
                                   <p className="text-xs font-bold text-indigo-600 uppercase mb-1">{product.category}</p>
                                   <h3 className="font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                                   <p className="text-gray-500 font-medium">KSh {product.price.toLocaleString()}</p>
                               </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      )}
    </div>
  );
};