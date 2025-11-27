import React, { useState } from 'react';
import { Product } from '../types';
import { ArrowLeft, ShoppingCart, Share2, Heart, MessageCircle } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="animate-fade-in space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Back to Marketplace
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Gallery Section */}
          <div className="p-6 md:p-8 bg-gray-50 flex flex-col gap-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm relative border border-gray-100">
               {product.imageUrls && product.imageUrls.length > 0 ? (
                 <img 
                   src={product.imageUrls[activeImageIndex]} 
                   alt={product.name} 
                   className="w-full h-full object-contain"
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-300">
                   No Image Available
                 </div>
               )}
            </div>
            
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.imageUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent opacity-70 hover:opacity-100 bg-white'
                    }`}
                  >
                    <img src={url} alt={`View ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="p-8 md:p-12 flex flex-col">
            <div className="flex items-start justify-between mb-4">
               <div>
                  <span className="text-indigo-600 font-bold text-xs tracking-widest uppercase mb-2 block bg-indigo-50 w-fit px-2 py-1 rounded">
                    {product.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                    {product.name}
                  </h1>
               </div>
               <button className="p-3 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                 <Heart size={24} />
               </button>
            </div>

            <div className="text-4xl font-bold text-gray-900 mb-8">
               <span className="text-lg font-medium text-gray-500 mr-1">KSh</span>
               {product.price.toLocaleString()}
            </div>

            <div className="prose prose-sm text-gray-600 leading-relaxed mb-8 flex-1">
               <p>{product.description}</p>
            </div>

            <div className="space-y-4 mt-auto pt-6 border-t border-gray-100">
              <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-200 hover:shadow-xl hover:-translate-y-0.5">
                <MessageCircle size={24} /> Contact Seller
              </button>
              <div className="grid grid-cols-2 gap-4">
                  <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5">
                    <ShoppingCart size={22} /> Buy Now
                  </button>
                  <button className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Share2 size={22} /> Share
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};