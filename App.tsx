import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { ViewState, Product, JobPosting } from './types';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ProductList } from './components/ProductList';
import { JobList } from './components/JobList';
import { CreateProduct } from './components/CreateProduct';
import { CreateJob } from './components/CreateJob';

// Seed Data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Minimalist Desk Lamp',
    price: 45.00,
    category: 'Home & Garden',
    description: 'A sleek, modern desk lamp with adjustable brightness and warm led light. Perfect for late night study sessions.',
    imageUrl: 'https://picsum.photos/400/400?random=1',
    createdAt: Date.now() - 10000000
  },
  {
    id: '2',
    name: 'Wireless Noise Cancelling Headphones',
    price: 129.99,
    category: 'Electronics',
    description: 'Immerse yourself in music with these high-fidelity wireless headphones featuring active noise cancellation.',
    imageUrl: 'https://picsum.photos/400/400?random=2',
    createdAt: Date.now() - 5000000
  }
];

const initialJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Creative Solutions',
    location: 'Remote',
    salaryRange: '80k - 110k',
    type: 'Full-time',
    description: 'We are looking for a skilled React developer to join our growing team. You will be building modern web applications using the latest tech stack.',
    createdAt: Date.now() - 20000000
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs);

  const handleProductSubmit = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    setCurrentView(ViewState.PRODUCTS);
  };

  const handleJobSubmit = (job: JobPosting) => {
    setJobs(prev => [job, ...prev]);
    setCurrentView(ViewState.JOBS);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hidden Navigation Component */}
      <Navigation 
        isOpen={isNavOpen} 
        onClose={() => setIsNavOpen(false)} 
        currentView={currentView}
        onChangeView={setCurrentView}
      />

      {/* Main Header / Trigger */}
      <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-30 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
         <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsNavOpen(true)}
             className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-200"
             aria-label="Open Navigation"
           >
             <Menu size={24} />
           </button>
           <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
             MarketHub
           </h1>
         </div>
         <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-sm text-gray-500">
              {currentView === ViewState.DASHBOARD && 'Dashboard'}
              {currentView === ViewState.PRODUCTS && 'Marketplace'}
              {currentView === ViewState.JOBS && 'Careers'}
              {currentView === ViewState.NEW_PRODUCT && 'New Listing'}
              {currentView === ViewState.NEW_JOB && 'Post Job'}
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200" />
         </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto min-h-screen">
        {currentView === ViewState.DASHBOARD && (
          <Dashboard products={products} jobs={jobs} />
        )}
        
        {currentView === ViewState.PRODUCTS && (
          <ProductList products={products} />
        )}

        {currentView === ViewState.JOBS && (
          <JobList jobs={jobs} />
        )}

        {currentView === ViewState.NEW_PRODUCT && (
          <CreateProduct 
            onCancel={() => setCurrentView(ViewState.DASHBOARD)} 
            onSubmit={handleProductSubmit}
          />
        )}

        {currentView === ViewState.NEW_JOB && (
          <CreateJob 
            onCancel={() => setCurrentView(ViewState.DASHBOARD)} 
            onSubmit={handleJobSubmit}
          />
        )}
      </main>
    </div>
  );
};

export default App;
