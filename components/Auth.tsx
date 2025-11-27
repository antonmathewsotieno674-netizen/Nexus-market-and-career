import React, { useState, useEffect } from 'react';
import { ViewState, User } from '../types';
import { authService } from '../services/authService';
import { Loader2, Mail, Lock, User as UserIcon, ArrowLeft, CheckCircle, Send } from 'lucide-react';

interface AuthProps {
  initialView: ViewState;
  onLoginSuccess: (user: User) => void;
  onChangeView: (view: ViewState) => void;
}

export const Auth: React.FC<AuthProps> = ({ initialView, onLoginSuccess, onChangeView }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Reset state when view changes
  useEffect(() => {
    setFormData({ name: '', email: '', password: '' });
    setError('');
    setSuccessMsg('');
    setIsResetSent(false);
  }, [initialView]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (initialView === ViewState.LOGIN) {
        const user = await authService.login(formData.email, formData.password);
        onLoginSuccess(user);
      } else if (initialView === ViewState.REGISTER) {
        const user = await authService.register(formData.name, formData.email, formData.password);
        onLoginSuccess(user);
      } else if (initialView === ViewState.FORGOT_PASSWORD) {
        await authService.resetPassword(formData.email);
        setIsResetSent(true);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Render dedicated Success View for Forgot Password
  if (initialView === ViewState.FORGOT_PASSWORD && isResetSent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-center p-8">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-500 mb-8">
            We've sent a password reset link to <span className="font-medium text-gray-900">{formData.email}</span>.
          </p>
          <button 
            onClick={() => onChangeView(ViewState.LOGIN)}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Login
          </button>
          <button 
            onClick={() => setIsResetSent(false)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-900 underline"
          >
            Didn't receive the email? Click to retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-2">
              Nexus Market
            </h1>
            <h2 className="text-xl font-semibold text-gray-900">
              {initialView === ViewState.LOGIN && 'Welcome Back'}
              {initialView === ViewState.REGISTER && 'Create Account'}
              {initialView === ViewState.FORGOT_PASSWORD && 'Reset Password'}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {initialView === ViewState.LOGIN && 'Enter your credentials to access your account'}
              {initialView === ViewState.REGISTER && 'Join our community of buyers and sellers'}
              {initialView === ViewState.FORGOT_PASSWORD && 'Enter your email to receive reset instructions'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center">
               {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 text-green-600 text-sm rounded-xl border border-green-100">
               {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {initialView === ViewState.REGISTER && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {initialView !== ViewState.FORGOT_PASSWORD && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  {initialView === ViewState.LOGIN && (
                    <button 
                      type="button"
                      onClick={() => onChangeView(ViewState.FORGOT_PASSWORD)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-70 flex justify-center items-center gap-2 mt-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {initialView === ViewState.LOGIN && 'Sign In'}
              {initialView === ViewState.REGISTER && 'Create Account'}
              {initialView === ViewState.FORGOT_PASSWORD && (
                <>
                  <Send size={18} /> Send Reset Link
                </>
              )}
            </button>
          </form>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          {initialView === ViewState.LOGIN ? (
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                onClick={() => onChangeView(ViewState.REGISTER)}
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Sign up
              </button>
            </p>
          ) : initialView === ViewState.REGISTER ? (
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => onChangeView(ViewState.LOGIN)}
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Log in
              </button>
            </p>
          ) : (
            <button 
              onClick={() => onChangeView(ViewState.LOGIN)}
              className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mx-auto"
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};