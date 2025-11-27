import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { ViewState, Product, JobPosting, User } from './types';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ProductList } from './components/ProductList';
import { JobList } from './components/JobList';
import { CreateProduct } from './components/CreateProduct';
import { CreateJob } from './components/CreateJob';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { Help } from './components/Help';
import { Auth } from './components/Auth';
import { authService } from './services/authService';

// Seed Data with KSh pricing
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Minimalist Desk Lamp',
    price: 4500,
    category: 'Home & Garden',
    description: 'A sleek, modern desk lamp with adjustable brightness and warm led light. Perfect for late night study sessions.',
    imageUrl: 'https://picsum.photos/400/400?random=1',
    createdAt: Date.now() - 10000000
  },
  {
    id: '2',
    name: 'Wireless Noise Cancelling Headphones',
    price: 15999,
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
    salaryRange: 'KSh 80k - 110k',
    type: 'Full-time',
    description: 'We are looking for a skilled React developer to join our growing team. You will be building modern web applications using the latest tech stack.',
    createdAt: Date.now() - 20000000
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs);

  useEffect(() => {
    // Check for existing user session
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleProductSubmit = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    setCurrentView(ViewState.PRODUCTS);
  };

  const handleJobSubmit = (job: JobPosting) => {
    setJobs(prev => [job, ...prev]);
    setCurrentView(ViewState.JOBS);
  };

  const handleLoginSuccess = (user: User) => {
    setUser(user);
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentView(ViewState.LOGIN);
  };

  // Auth guard wrapper
  const requireAuth = (view: React.ReactNode) => {
    if (!user) {
      // If user tries to access restricted content, redirect or show Auth
      // Here we just return the Auth component for simplicity in this flow
      return <Auth initialView={ViewState.LOGIN} onLoginSuccess={handleLoginSuccess} onChangeView={setCurrentView} />;
    }
    return view;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Hidden Navigation Component */}
      <Navigation 
        isOpen={isNavOpen} 
        onClose={() => setIsNavOpen(false)} 
        currentView={currentView}
        onChangeView={setCurrentView}
        user={user}
        onLogout={handleLogout}
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
             Nexus Market
           </h1>
         </div>
         <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-sm text-gray-500 font-medium">
              {currentView === ViewState.DASHBOARD && 'Dashboard'}
              {currentView === ViewState.PRODUCTS && 'Marketplace'}
              {currentView === ViewState.JOBS && 'Careers'}
              {currentView === ViewState.NEW_PRODUCT && 'New Listing'}
              {currentView === ViewState.NEW_JOB && 'Post Job'}
              {currentView === ViewState.PROFILE && 'My Profile'}
              {currentView === ViewState.SETTINGS && 'Settings'}
              {currentView === ViewState.HELP && 'Help Center'}
              {currentView === ViewState.LOGIN && 'Sign In'}
              {currentView === ViewState.REGISTER && 'Create Account'}
              {currentView === ViewState.FORGOT_PASSWORD && 'Reset Password'}
            </span>
            <button 
              onClick={() => user ? setCurrentView(ViewState.PROFILE) : setCurrentView(ViewState.LOGIN)} 
              className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700 overflow-hidden"
            >
               {user?.avatar || 'U'}
            </button>
         </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto min-h-screen">
        {(currentView === ViewState.LOGIN || currentView === ViewState.REGISTER || currentView === ViewState.FORGOT_PASSWORD) ? (
          <Auth initialView={currentView} onLoginSuccess={handleLoginSuccess} onChangeView={setCurrentView} />
        ) : (
          <>
            {currentView === ViewState.DASHBOARD && (
              <Dashboard products={products} jobs={jobs} />
            )}
            
            {currentView === ViewState.PRODUCTS && (
              <ProductList products={products} />
            )}

            {currentView === ViewState.JOBS && (
              <JobList jobs={jobs} />
            )}

            {currentView === ViewState.NEW_PRODUCT && requireAuth(
              <CreateProduct 
                onCancel={() => setCurrentView(ViewState.DASHBOARD)} 
                onSubmit={handleProductSubmit}
              />
            )}

            {currentView === ViewState.NEW_JOB && requireAuth(
              <CreateJob 
                onCancel={() => setCurrentView(ViewState.DASHBOARD)} 
                onSubmit={handleJobSubmit}
              />
            )}

            {currentView === ViewState.PROFILE && requireAuth(<Profile />)}
            {currentView === ViewState.SETTINGS && requireAuth(<Settings />)}
            {currentView === ViewState.HELP && <Help />}
          </>
        )}
      </main>
    </div>
  );
};

export default App;