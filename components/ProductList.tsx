import React from 'react';
import { Product } from '../types';
import { Tag, Clock } from 'lucide-react';

interface ProductListProps {
  products: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
        <div className="text-gray-400 mb-4">
          <Tag size={48} className="mx-auto" />
        </div>
        <h3 className="text-xl font-medium text-gray-900">No products listed</h3>
        <p className="text-gray-500 mt-2">Get started by adding your first product for sale.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Marketplace</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
               {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Tag size={48} />
                 </div>
               )}
               <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
                 ${product.price.toFixed(2)}
               </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md uppercase tracking-wide">
                  {product.category}
                </span>
                <span className="flex items-center text-xs text-gray-400 ml-auto">
                  <Clock size={12} className="mr-1" />
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{product.name}</h3>
              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                {product.description}
              </p>
              <button className="w-full mt-4 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
