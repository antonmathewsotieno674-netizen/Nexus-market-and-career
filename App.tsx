import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { ViewState, Product, JobPosting, User, JobApplication } from './types';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ProductList } from './components/ProductList';
import { ProductDetail } from './components/ProductDetail';
import { JobList } from './components/JobList';
import { CreateProduct } from './components/CreateProduct';
import { CreateJob } from './components/CreateJob';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { Help } from './components/Help';
import { Auth } from './components/Auth';
import { JobApplications } from './components/JobApplications';
import { Chat } from './components/Chat';
import { authService } from './services/authService';
import { chatService } from './services/chatService';
import { themeService } from './services/themeService';

// Seed Data with KSh pricing
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Minimalist Desk Lamp',
    price: 4500,
    category: 'Home & Garden',
    description: 'A sleek, modern desk lamp with adjustable brightness and warm led light. Perfect for late night study sessions.',
    imageUrls: ['https://picsum.photos/400/400?random=1', 'https://picsum.photos/400/400?random=101'],
    seller: {
      id: '2',
      name: 'Jane Seller',
      email: 'jane@example.com',
      phone: '+254 700 123456',
      location: 'Nairobi, Kenya'
    },
    rating: 4.5,
    reviewCount: 12,
    createdAt: Date.now() - 10000000
  },
  {
    id: '2',
    name: 'Wireless Noise Cancelling Headphones',
    price: 15999,
    category: 'Electronics',
    description: 'Immerse yourself in music with these high-fidelity wireless headphones featuring active noise cancellation.',
    imageUrls: ['https://picsum.photos/400/400?random=2', 'https://picsum.photos/400/400?random=102', 'https://picsum.photos/400/400?random=202'],
    seller: {
      id: '2',
      name: 'Jane Seller',
      email: 'jane@example.com',
      phone: '+254 700 123456',
      location: 'Nairobi, Kenya'
    },
    rating: 4.8,
    reviewCount: 45,
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
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'DesignStudio',
    location: 'Nairobi',
    salaryRange: 'KSh 70k - 90k',
    type: 'Full-time',
    description: 'Join our creative team to design world-class user interfaces.',
    createdAt: Date.now() - 5000000
  }
];

// Seed Applications
const initialApplications: JobApplication[] = [
  {
    id: '101',
    jobId: '1',
    jobTitle: 'Frontend Developer',
    company: 'Creative Solutions',
    applicantName: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'Pending',
    appliedAt: Date.now() - 86400000
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs);
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications);

  useEffect(() => {
    // Check for existing user session
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    // Initialize Theme
    themeService.initTheme();
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

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView(ViewState.PRODUCT_DETAIL);
  };

  const handleJobApply = (job: JobPosting, coverLetter: string) => {
    if (!user) {
      setCurrentView(ViewState.LOGIN);
      return;
    }

    const newApplication: JobApplication = {
      id: Date.now().toString(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      applicantName: user.name,
      email: user.email,
      coverLetter: coverLetter,
      status: 'Pending',
      appliedAt: Date.now()
    };
    
    setApplications(prev => [newApplication, ...prev]);
  };

  const handleApplicationStatusUpdate = (id: string, newStatus: JobApplication['status']) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  const handleContactSeller = (product: Product) => {
    if (!user) {
      setCurrentView(ViewState.LOGIN);
      return;
    }

    if (!product.seller) {
      alert("Seller information is missing.");
      return;
    }

    // Don't chat with yourself
    if (product.seller.id === user.id) {
      alert("You cannot message yourself.");
      return;
    }

    // Convert seller info to User type for the chat service
    const sellerUser: User = {
       id: product.seller.id,
       name: product.seller.name,
       email: product.seller.email,
       phone: product.seller.phone,
       location: product.seller.location
    };

    // Create or retrieve conversation
    const chatId = chatService.startConversation(user, sellerUser, product);
    setActiveChatId(chatId);
    setCurrentView(ViewState.MESSAGES);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
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
      <header className="fixed top-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-30 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between transition-colors duration-200">
         <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsNavOpen(true)}
             className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-200"
             aria-label="Open Navigation"
           >
             <Menu size={24} />
           </button>
           <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
             Nexus Market
           </h1>
         </div>
         <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-sm text-gray-500 dark:text-gray-400 font-medium">
              {currentView === ViewState.DASHBOARD && 'Dashboard'}
              {currentView === ViewState.PRODUCTS && 'Marketplace'}
              {currentView === ViewState.PRODUCT_DETAIL && 'Product Details'}
              {currentView === ViewState.JOBS && 'Careers'}
              {currentView === ViewState.NEW_PRODUCT && 'New Listing'}
              {currentView === ViewState.NEW_JOB && 'Post Job'}
              {currentView === ViewState.APPLICATIONS && 'Applications'}
              {currentView === ViewState.MESSAGES && 'Messages'}
              {currentView === ViewState.PROFILE && 'My Profile'}
              {currentView === ViewState.SETTINGS && 'Settings'}
              {currentView === ViewState.HELP && 'Help Center'}
              {currentView === ViewState.LOGIN && 'Sign In'}
              {currentView === ViewState.REGISTER && 'Create Account'}
              {currentView === ViewState.FORGOT_PASSWORD && 'Reset Password'}
            </span>
            <button 
              onClick={() => user ? setCurrentView(ViewState.PROFILE) : setCurrentView(ViewState.LOGIN)} 
              className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-400 overflow-hidden"
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
              <ProductList products={products} onProductSelect={handleProductSelect} user={user} />
            )}

            {currentView === ViewState.PRODUCT_DETAIL && selectedProduct && (
              <ProductDetail 
                product={selectedProduct} 
                user={user}
                onBack={() => setCurrentView(ViewState.PRODUCTS)}
                onContactSeller={handleContactSeller}
              />
            )}

            {currentView === ViewState.JOBS && (
              <JobList jobs={jobs} onApply={handleJobApply} />
            )}

            {currentView === ViewState.NEW_PRODUCT && requireAuth(
              <CreateProduct 
                onCancel={() => setCurrentView(ViewState.DASHBOARD)} 
                onSubmit={handleProductSubmit}
                user={user!}
              />
            )}

            {currentView === ViewState.NEW_JOB && requireAuth(
              <CreateJob 
                onCancel={() => setCurrentView(ViewState.DASHBOARD)} 
                onSubmit={handleJobSubmit}
              />
            )}
            
            {currentView === ViewState.APPLICATIONS && requireAuth(
              <JobApplications 
                applications={applications} 
                isEmployer={true} 
                onStatusUpdate={handleApplicationStatusUpdate}
              />
            )}

            {currentView === ViewState.MESSAGES && requireAuth(
              <Chat 
                user={user!}
                initialChatId={activeChatId}
              />
            )}

            {currentView === ViewState.PROFILE && requireAuth(<Profile user={user} />)}
            {currentView === ViewState.SETTINGS && requireAuth(<Settings />)}
            {currentView === ViewState.HELP && <Help />}
          </>
        )}
      </main>
    </div>
  );
};

export default App;