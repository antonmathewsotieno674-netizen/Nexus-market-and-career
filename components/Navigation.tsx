import React from 'react';
import { X, LayoutDashboard, ShoppingBag, Briefcase, PlusCircle, User, Settings, HelpCircle, LogOut, LogIn, UserPlus, FileCheck } from 'lucide-react';
import { ViewState, NavItem, User as UserType } from '../types';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  user: UserType | null;
  onLogout: () => void;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', view: ViewState.DASHBOARD, icon: LayoutDashboard },
  { label: 'Marketplace', view: ViewState.PRODUCTS, icon: ShoppingBag },
  { label: 'Sell Product', view: ViewState.NEW_PRODUCT, icon: PlusCircle },
  { label: 'Careers', view: ViewState.JOBS, icon: Briefcase },
  { label: 'Post Job', view: ViewState.NEW_JOB, icon: PlusCircle },
  { label: 'Applications', view: ViewState.APPLICATIONS, icon: FileCheck },
];

const secondaryItems: NavItem[] = [
  { label: 'Profile', view: ViewState.PROFILE, icon: User },
  { label: 'Settings', view: ViewState.SETTINGS, icon: Settings },
  { label: 'Help & Support', view: ViewState.HELP, icon: HelpCircle },
];

export const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose, currentView, onChangeView, user, onLogout }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Nexus Market
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-6">
          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>
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
          </div>

          {user && (
            <div className="space-y-1">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</p>
              {secondaryItems.map((item) => {
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
                        ? 'bg-violet-50 text-violet-700 font-medium shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-violet-600' : 'text-gray-400'} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
          {user ? (
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
                  onChangeView(ViewState.PROFILE);
                  onClose();
               }}>
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {user.avatar || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">Premium Member</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-100 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          ) : (
             <div className="space-y-3">
               <button 
                  onClick={() => {
                    onChangeView(ViewState.LOGIN);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
               >
                 <LogIn size={18} /> Log In
               </button>
               <button 
                  onClick={() => {
                    onChangeView(ViewState.REGISTER);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm shadow-indigo-200"
               >
                 <UserPlus size={18} /> Create Account
               </button>
             </div>
          )}
        </div>
      </div>
    </>
  );
};