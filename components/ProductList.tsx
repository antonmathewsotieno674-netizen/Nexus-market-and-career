import React, { useState } from 'react';
import { Product } from '../types';
import { Tag, Clock, Search, SlidersHorizontal, MoreHorizontal, Edit, Trash2, Layers } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onProductSelect?: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveMenu(activeMenu === id ? null : id);
  };

  return (
    <div className="space-y-6" onClick={() => setActiveMenu(null)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Marketplace</h2>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="text-gray-400 mb-4">
            <Tag size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900">No products listed</h3>
          <p className="text-gray-500 mt-2">Get started by adding your first product for sale.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-300 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No matches found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible hover:shadow-lg transition-all duration-300 group flex flex-col h-full relative cursor-pointer"
              onClick={() => onProductSelect && onProductSelect(product)}
            >
              
              {/* Product Settings / Menu */}
              <div className="absolute top-3 right-3 z-20">
                 <button 
                  onClick={(e) => toggleMenu(product.id, e)}
                  className="p-1.5 bg-white/90 backdrop-blur rounded-full hover:bg-gray-100 transition-colors text-gray-600 shadow-sm"
                 >
                   <MoreHorizontal size={20} />
                 </button>
                 
                 {activeMenu === product.id && (
                   <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden animate-fade-in z-30">
                     <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                       <Edit size={16} /> Edit Listing
                     </button>
                     <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                       <Trash2 size={16} /> Delete
                     </button>
                   </div>
                 )}
              </div>

              <div className="aspect-square bg-gray-100 relative overflow-hidden shrink-0 rounded-t-2xl">
                 {product.imageUrls && product.imageUrls.length > 0 ? (
                    <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Tag size={48} />
                   </div>
                 )}
                 
                 {product.imageUrls && product.imageUrls.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                        <Layers size={12} />
                        {product.imageUrls.length}
                    </div>
                 )}

                 <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm z-10">
                   KSh {product.price.toLocaleString()}
                 </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
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
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4 flex-1">
                  {product.description}
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(onProductSelect) onProductSelect(product);
                  }}
                  className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors mt-auto"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};