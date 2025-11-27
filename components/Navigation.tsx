import React from 'react';
import { X, LayoutDashboard, ShoppingBag, Briefcase, PlusCircle } from 'lucide-react';
import { ViewState, NavItem } from '../types';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', view: ViewState.DASHBOARD, icon: LayoutDashboard },
  { label: 'Marketplace', view: ViewState.PRODUCTS, icon: ShoppingBag },
  { label: 'Sell Product', view: ViewState.NEW_PRODUCT, icon: PlusCircle },
  { label: 'Careers', view: ViewState.JOBS, icon: Briefcase },
  { label: 'Post Job', view: ViewState.NEW_JOB, icon: PlusCircle },
];

export const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose, currentView, onChangeView }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            MarketHub
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => {
                  onChangeView(item.view);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              JD
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Premium Seller</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
