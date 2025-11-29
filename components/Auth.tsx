import React, { useState, useEffect } from 'react';
import { ViewState, User } from '../types';
import { authService } from '../services/authService';
import { Loader2, Mail, Lock, User as UserIcon, ArrowLeft, CheckCircle, Send, Phone, Facebook, Twitter, Instagram, Globe } from 'lucide-react';

interface AuthProps {
  initialView: ViewState;
  onLoginSuccess: (user: User) => void;
  onChangeView: (view: ViewState) => void;
}

export const Auth: React.FC<AuthProps> = ({ initialView, onLoginSuccess, onChangeView }) => {
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  // Reset state when view changes
  useEffect(() => {
    setFormData({ name: '', email: '', phone: '', password: '' });
    setError('');
    setSuccessMsg('');
    setIsResetSent(false);
  }, [initialView]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    setError('');
    try {
      const user = await authService.loginWithProvider(provider);
      onLoginSuccess(user);
    } catch (err) {
      setError('Social login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    // Validation
    if (authMethod === 'email') {
      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }
    }

    try {
      const identifier = authMethod === 'email' ? formData.email : formData.phone;

      if (initialView === ViewState.LOGIN) {
        const user = await authService.login(identifier, formData.password);
        onLoginSuccess(user);
      } else if (initialView === ViewState.REGISTER) {
        const user = await authService.register(formData.name, identifier, formData.password, authMethod);
        onLoginSuccess(user);
      } else if (initialView === ViewState.FORGOT_PASSWORD) {
        await authService.resetPassword(identifier);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your {authMethod}</h2>
          <p className="text-gray-500 mb-8">
            We've sent a password reset link to <span className="font-medium text-gray-900">{authMethod === 'email' ? formData.email : formData.phone}</span>.
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
            Didn't receive the link? Click to retry
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
              {initialView === ViewState.FORGOT_PASSWORD && 'Enter details to recover your account'}
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

          {/* Auth Method Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
            <button 
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${authMethod === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Email
            </button>
            <button 
              type="button"
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${authMethod === 'phone' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Phone
            </button>
          </div>

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

            {authMethod === 'email' ? (
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
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="07XX XXX XXX"
                  />
                </div>
              </div>
            )}

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

          {/* Social Login Section */}
          {initialView !== ViewState.FORGOT_PASSWORD && (
            <div className="mt-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <button 
                  onClick={() => handleSocialLogin('Google')}
                  disabled={loading}
                  className="flex items-center justify-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                  title="Sign in with Google"
                >
                  <Globe size={20} className="text-gray-700" />
                </button>
                <button 
                  onClick={() => handleSocialLogin('Facebook')}
                  disabled={loading}
                  className="flex items-center justify-center p-3 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all"
                  title="Sign in with Facebook"
                >
                  <Facebook size={20} className="text-gray-700" />
                </button>
                <button 
                  onClick={() => handleSocialLogin('Twitter')}
                  disabled={loading}
                  className="flex items-center justify-center p-3 border border-gray-200 rounded-xl hover:bg-sky-50 hover:border-sky-200 hover:text-sky-500 transition-all"
                  title="Sign in with Twitter"
                >
                  <Twitter size={20} className="text-gray-700" />
                </button>
                <button 
                  onClick={() => handleSocialLogin('Instagram')}
                  disabled={loading}
                  className="flex items-center justify-center p-3 border border-gray-200 rounded-xl hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600 transition-all"
                  title="Sign in with Instagram"
                >
                  <Instagram size={20} className="text-gray-700" />
                </button>
              </div>
            </div>
          )}
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