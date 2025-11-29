import React, { useState } from 'react';
import { Product, User } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { Sparkles, Image as ImageIcon, Loader2, X, Plus, Trash2 } from 'lucide-react';

interface CreateProductProps {
  onCancel: () => void;
  onSubmit: (product: Product) => void;
  user: User;
}

export const CreateProduct: React.FC<CreateProductProps> = ({ onCancel, onSubmit, user }) => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    imageUrls: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
             setFormData(prev => ({
               ...prev,
               imageUrls: [...prev.imageUrls, reader.result as string]
             }));
          }
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleAIGenerate = async () => {
    if (!formData.name || !formData.category) {
      alert("Please fill in Name and Category first.");
      return;
    }
    setGenerating(true);
    const desc = await generateProductDescription(formData.name, formData.category);
    setFormData(prev => ({ ...prev, description: desc }));
    setGenerating(false);
  };

  const handleClearDescription = () => {
    setFormData(prev => ({ ...prev, description: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        imageUrls: formData.imageUrls,
        createdAt: Date.now(),
        seller: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          location: user.location || ''
        }
      };
      onSubmit(newProduct);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">List New Product</h2>
        <p className="text-gray-500">Add details about what you're selling.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        
        {/* Image Upload */}
        <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Product Images</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
                
                <div className="relative aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer group">
                    <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        onChange={handleImageChange} 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    />
                    <div className="text-gray-400 group-hover:text-indigo-500 transition-colors">
                        <Plus size={24} className="mx-auto" />
                        <span className="text-xs font-medium mt-1 block">Add Images</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Product Name</label>
            <input 
              required
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              placeholder="e.g. Vintage Camera"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Price (KSh)</label>
            <input 
              required
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select 
            required
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none appearance-none"
          >
            <option value="">Select a category...</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home & Garden">Home & Garden</option>
            <option value="Sports">Sports</option>
            <option value="Art & Collectibles">Art & Collectibles</option>
          </select>
        </div>

        <div className="space-y-2 relative">
          <div className="flex justify-between items-center">
             <label className="text-sm font-medium text-gray-700">Description</label>
             <div className="flex items-center gap-3">
               {formData.description && (
                 <button
                   type="button"
                   onClick={handleClearDescription}
                   className="text-xs flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors"
                 >
                   <Trash2 size={12} /> Clear
                 </button>
               )}
               <button 
                 type="button"
                 onClick={handleAIGenerate}
                 disabled={generating}
                 className="text-xs flex items-center gap-1.5 text-indigo-600 font-medium hover:text-indigo-700 disabled:opacity-50"
               >
                  {generating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {generating ? 'Generating...' : 'Auto-Write with AI'}
               </button>
             </div>
          </div>
          <textarea 
            required
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={10} 
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none font-sans"
            placeholder="Describe your product... (Use AI to generate features!)"
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
             Publish Listing
           </button>
        </div>
      </form>
    </div>
  );
};