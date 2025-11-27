import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Tag, Clock, Search, SlidersHorizontal, MoreHorizontal, Edit, Trash2, Layers, Star, X, Filter } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onProductSelect?: (product: Product) => void;
}

type SortOption = 'newest' | 'price-low' | 'price-high' | 'rating';

export const ProductList: React.FC<ProductListProps> = ({ products, onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // Filtering and Sorting State
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [minRating, setMinRating] = useState<number>(0);
  
  // Autocomplete State
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const matches = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm, products]);

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = (product.rating || 0) >= minRating;
      
      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
        default:
          return b.createdAt - a.createdAt;
      }
    });

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleSuggestionClick = (product: Product) => {
    setSearchTerm(product.name);
    setShowSuggestions(false);
    if(onProductSelect) onProductSelect(product);
  };

  return (
    <div className="space-y-6" onClick={() => { setActiveMenu(null); setShowSuggestions(false); }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Marketplace</h2>
        
        <div className="flex gap-2 w-full md:w-auto z-30">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => { if(searchTerm) setShowSuggestions(true); }}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
            />
            
            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in z-50">
                 {suggestions.map(item => (
                   <button
                    key={item.id}
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700 last:border-0 flex items-center justify-between group"
                   >
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{item.name}</span>
                     <span className="text-xs text-gray-400">{item.category}</span>
                   </button>
                 ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); setShowFilters(!showFilters); }}
            className={`p-2.5 border rounded-xl transition-colors ${
              showFilters 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="space-y-2">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sort By</label>
             <select 
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value as SortOption)}
               className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
             >
               <option value="newest">Newest Listed</option>
               <option value="price-low">Price: Low to High</option>
               <option value="price-high">Price: High to Low</option>
               <option value="rating">Highest Rated</option>
             </select>
           </div>

           <div className="space-y-2">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Min. Rating</label>
             <div className="flex gap-2">
                {[4, 3, 2, 0].map((star) => (
                  <button
                    key={star}
                    onClick={() => setMinRating(star)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-1 ${
                      minRating === star 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {star === 0 ? 'Any' : (
                      <>
                        {star}+ <Star size={12} fill="currentColor" />
                      </>
                    )}
                  </button>
                ))}
             </div>
           </div>

           <div className="space-y-2 flex items-end">
              <button 
                onClick={() => {
                  setSortBy('newest');
                  setMinRating(0);
                  setSearchTerm('');
                  setShowFilters(false);
                }}
                className="w-full py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <X size={16} /> Clear Filters
              </button>
           </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
          <div className="text-gray-400 mb-4">
            <Tag size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">No products listed</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Get started by adding your first product for sale.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-300 dark:text-gray-600 mb-4">
            <Filter size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No matches found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-visible hover:shadow-lg transition-all duration-300 group flex flex-col h-full relative cursor-pointer"
              onClick={() => onProductSelect && onProductSelect(product)}
            >
              
              {/* Product Settings / Menu */}
              <div className="absolute top-3 right-3 z-20">
                 <button 
                  onClick={(e) => toggleMenu(product.id, e)}
                  className="p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 shadow-sm"
                 >
                   <MoreHorizontal size={20} />
                 </button>
                 
                 {activeMenu === product.id && (
                   <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 overflow-hidden animate-fade-in z-30">
                     <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                       <Edit size={16} /> Edit Listing
                     </button>
                     <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                       <Trash2 size={16} /> Delete
                     </button>
                   </div>
                 )}
              </div>

              <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden shrink-0 rounded-t-2xl">
                 {product.imageUrls && product.imageUrls.length > 0 ? (
                    <img 
                        src={product.imageUrls[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        loading="lazy"
                    />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                      <Tag size={48} />
                   </div>
                 )}
                 
                 {product.imageUrls && product.imageUrls.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                        <Layers size={12} />
                        {product.imageUrls.length}
                    </div>
                 )}

                 <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 dark:text-white shadow-sm z-10">
                   KSh {product.price.toLocaleString()}
                 </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-md uppercase tracking-wide">
                    {product.category}
                  </span>
                  {product.rating && (
                     <span className="flex items-center text-xs font-bold text-amber-500 ml-auto">
                        <Star size={12} fill="currentColor" className="mr-1" />
                        {product.rating} <span className="text-gray-400 font-normal ml-1">({product.reviewCount})</span>
                     </span>
                  )}
                  {!product.rating && (
                    <span className="flex items-center text-xs text-gray-400 ml-auto">
                        <Clock size={12} className="mr-1" />
                        {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 truncate">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed mb-4 flex-1">
                  {product.description}
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(onProductSelect) onProductSelect(product);
                  }}
                  className="w-full py-2.5 bg-gray-900 dark:bg-gray-800 text-white rounded-xl font-medium hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors mt-auto"
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