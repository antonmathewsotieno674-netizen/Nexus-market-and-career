import React, { useState, useEffect } from 'react';
import { Product, User } from '../types';
import { wishlistService } from '../services/wishlistService';
import { ArrowLeft, ShoppingCart, Share2, Heart, MessageCircle, Check, ZoomIn, X, Smartphone, CreditCard, Banknote, Globe, Loader2, CheckCircle, Landmark } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  user: User | null;
  onBack: () => void;
  onContactSeller?: (product: Product) => void;
}

type PaymentMethod = 'MPESA' | 'CARD' | 'PAYPAL' | 'STRIPE' | 'BANK_TRANSFER' | 'CASH';

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, user, onBack, onContactSeller }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MPESA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    phone: user?.phone || '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    paypalEmail: user?.email || '',
    stripeEmail: user?.email || '',
    bankRef: '',
  });

  useEffect(() => {
    if (user) {
      setIsWishlisted(wishlistService.isInWishlist(user.id, product.id));
    }
  }, [user, product.id]);

  // Helper function to render text with bullet points cleanly
  const renderFormattedDescription = (text: string) => {
    return text.split('\n').map((line, index) => {
      const trimmed = line.trim();
      
      // Handle Headers
      if (trimmed.toLowerCase().startsWith('key features:') || trimmed.toLowerCase().startsWith('features:')) {
         return <h3 key={index} className="font-bold text-gray-900 mt-6 mb-3 text-sm uppercase tracking-wide">{trimmed}</h3>;
      }
      
      // Handle Bullet Points
      if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
         const content = trimmed.substring(1).trim();
         return (
           <div key={index} className="flex items-start gap-3 mb-2.5">
             <div className="mt-1 text-indigo-600 shrink-0 bg-indigo-50 rounded-full p-0.5">
               <Check size={12} strokeWidth={3} />
             </div>
             <span className="text-gray-700 text-sm leading-relaxed">{content}</span>
           </div>
         );
      }
      
      // Handle Empty Lines
      if (trimmed.length === 0) return <div key={index} className="h-2" />;
      
      // Handle Regular Paragraphs
      return <p key={index} className="text-gray-600 mb-2 leading-relaxed">{trimmed}</p>;
    });
  };

  const handleContactClick = () => {
    if (onContactSeller) {
      onContactSeller(product);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
        setIsProcessing(false);
        setIsPaymentSuccess(true);
    }, 2000);
  };

  const closeCheckout = () => {
      setIsCheckoutOpen(false);
      setIsPaymentSuccess(false);
      setIsProcessing(false);
  };

  const toggleWishlist = () => {
    if (!user) {
      alert("Please log in to save items to your wishlist.");
      return;
    }

    if (isWishlisted) {
      wishlistService.removeFromWishlist(user.id, product.id);
      setIsWishlisted(false);
    } else {
      wishlistService.addToWishlist(user.id, product);
      setIsWishlisted(true);
    }
  };

  const handleShare = () => {
    alert("Sharing functionality is being implemented.");
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Lightbox Overlay */}
      {isLightboxOpen && (
        <div 
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in cursor-zoom-out"
            onClick={() => setIsLightboxOpen(false)}
        >
            <button className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full">
                <X size={32} />
            </button>
            {product.imageUrls && product.imageUrls.length > 0 && (
                <img 
                    src={product.imageUrls[activeImageIndex]} 
                    alt={product.name}
                    className="max-w-full max-h-full object-contain pointer-events-none animate-scale-in"
                />
            )}
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div>
                      <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
                      <p className="text-sm text-gray-500">Complete your purchase</p>
                  </div>
                  <button 
                    onClick={closeCheckout}
                    className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
              </div>

              {isPaymentSuccess ? (
                  <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 animate-scale-in">
                          <CheckCircle size={40} strokeWidth={3} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
                      <p className="text-gray-500">
                          Your order for <span className="font-semibold text-gray-900">{product.name}</span> has been placed.
                      </p>
                      <button 
                        onClick={closeCheckout}
                        className="mt-6 px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                      >
                          Continue Shopping
                      </button>
                  </div>
              ) : (
                  <div className="flex-1 overflow-y-auto p-6">
                      {/* Order Summary */}
                      <div className="flex gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200 shrink-0">
                             <img src={product.imageUrls[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                              <h4 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h4>
                              <p className="text-indigo-600 font-bold">KSh {product.price.toLocaleString()}</p>
                          </div>
                      </div>

                      <form onSubmit={handlePaymentSubmit} className="space-y-6">
                          <div className="space-y-3">
                              <label className="text-sm font-medium text-gray-700">Select Payment Method</label>
                              <div className="grid grid-cols-3 gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setPaymentMethod('MPESA')}
                                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'MPESA' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                                  >
                                      <Smartphone size={20} />
                                      <span className="text-[10px] font-bold">M-Pesa</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPaymentMethod('CARD')}
                                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'CARD' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                                  >
                                      <CreditCard size={20} />
                                      <span className="text-[10px] font-bold">Card</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPaymentMethod('PAYPAL')}
                                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'PAYPAL' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                                  >
                                      <Globe size={20} />
                                      <span className="text-[10px] font-bold">PayPal</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPaymentMethod('STRIPE')}
                                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'STRIPE' ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                                  >
                                      <CreditCard size={20} />
                                      <span className="text-[10px] font-bold">Stripe</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPaymentMethod('BANK_TRANSFER')}
                                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'BANK_TRANSFER' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                                  >
                                      <Landmark size={20} />
                                      <span className="text-[10px] font-bold text-center leading-tight">Bank Transfer</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPaymentMethod('CASH')}
                                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'CASH' ? 'border-gray-500 bg-gray-100 text-gray-700' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                                  >
                                      <Banknote size={20} />
                                      <span className="text-[10px] font-bold">Cash</span>
                                  </button>
                              </div>
                          </div>

                          {/* Dynamic Fields */}
                          <div className="space-y-4 animate-fade-in">
                              {paymentMethod === 'MPESA' && (
                                  <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-700">M-Pesa Phone Number</label>
                                      <input 
                                        required
                                        type="tel" 
                                        value={paymentDetails.phone}
                                        onChange={(e) => setPaymentDetails({...paymentDetails, phone: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        placeholder="07XX XXX XXX"
                                      />
                                      <p className="text-xs text-gray-500">You will receive an STK push on your phone.</p>
                                  </div>
                              )}

                              {(paymentMethod === 'CARD' || paymentMethod === 'STRIPE') && (
                                  <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            {paymentMethod === 'STRIPE' ? 'Stripe Email' : 'Cardholder Name'}
                                        </label>
                                        <input 
                                            required
                                            type="text" 
                                            value={paymentDetails.stripeEmail}
                                            onChange={(e) => setPaymentDetails({...paymentDetails, stripeEmail: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder={paymentMethod === 'STRIPE' ? "email@example.com" : "Name on card"}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Card Number</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={paymentDetails.cardNumber}
                                            onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="0000 0000 0000 0000"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Expiry</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={paymentDetails.cardExpiry}
                                                onChange={(e) => setPaymentDetails({...paymentDetails, cardExpiry: e.target.value})}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                placeholder="MM/YY"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">CVC</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={paymentDetails.cardCvc}
                                                onChange={(e) => setPaymentDetails({...paymentDetails, cardCvc: e.target.value})}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                placeholder="123"
                                            />
                                        </div>
                                    </div>
                                  </>
                              )}

                              {paymentMethod === 'PAYPAL' && (
                                  <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-700">PayPal Email</label>
                                      <input 
                                        required
                                        type="email" 
                                        value={paymentDetails.paypalEmail}
                                        onChange={(e) => setPaymentDetails({...paymentDetails, paypalEmail: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        placeholder="name@example.com"
                                      />
                                  </div>
                              )}
                              
                              {paymentMethod === 'BANK_TRANSFER' && (
                                  <div className="space-y-4">
                                      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-sm text-emerald-800 space-y-2">
                                          <p className="font-bold text-emerald-900">Bank Details:</p>
                                          <div className="grid grid-cols-3 gap-2">
                                              <span className="text-emerald-700/70">Bank:</span>
                                              <span className="col-span-2 font-medium">Nexus National Bank</span>
                                              <span className="text-emerald-700/70">Account:</span>
                                              <span className="col-span-2 font-medium">1234 5678 9000</span>
                                              <span className="text-emerald-700/70">Name:</span>
                                              <span className="col-span-2 font-medium">Nexus Market Ltd</span>
                                          </div>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Transaction Reference</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={paymentDetails.bankRef}
                                            onChange={(e) => setPaymentDetails({...paymentDetails, bankRef: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            placeholder="Enter transaction code (e.g. TXN12345)"
                                        />
                                    </div>
                                  </div>
                              )}
                              
                              {paymentMethod === 'CASH' && (
                                  <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600">
                                      <p>Pay with cash upon delivery. Please ensure you have the exact amount of <strong>KSh {product.price.toLocaleString()}</strong>.</p>
                                  </div>
                              )}
                          </div>

                          <div className="pt-4 border-t border-gray-100">
                              <button 
                                type="submit"
                                disabled={isProcessing}
                                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-200 disabled:opacity-70"
                              >
                                {isProcessing ? <Loader2 size={24} className="animate-spin" /> : 'Pay Now'}
                              </button>
                          </div>
                      </form>
                  </div>
              )}
           </div>
        </div>
      )}

      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Back to Marketplace
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Gallery Section */}
          <div className="p-6 md:p-8 bg-gray-50 flex flex-col gap-4">
            <div 
                className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm relative border border-gray-100 cursor-zoom-in group"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsLightboxOpen(true)}
            >
               {product.imageUrls && product.imageUrls.length > 0 ? (
                 <>
                    <img 
                      src={product.imageUrls[activeImageIndex]} 
                      alt={product.name} 
                      className="w-full h-full object-contain transition-transform duration-100 ease-out will-change-transform"
                      style={{
                          transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                          transform: isHovered ? 'scale(2)' : 'scale(1)',
                      }}
                      loading="lazy"
                    />
                    <div className={`absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-600 shadow-sm transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                        <ZoomIn size={20} />
                    </div>
                 </>
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-300">
                   No Image Available
                 </div>
               )}
            </div>
            
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.imageUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent opacity-70 hover:opacity-100 bg-white'
                    }`}
                  >
                    <img src={url} alt={`View ${idx}`} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="p-8 md:p-12 flex flex-col">
            <div className="flex items-start justify-between mb-4">
               <div>
                  <span className="text-indigo-600 font-bold text-xs tracking-widest uppercase mb-2 block bg-indigo-50 w-fit px-2 py-1 rounded">
                    {product.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                    {product.name}
                  </h1>
               </div>
               <button 
                onClick={toggleWishlist}
                className={`p-3 rounded-full transition-colors ${
                  isWishlisted 
                    ? 'bg-red-50 text-red-500' 
                    : 'bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
               >
                 <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
               </button>
            </div>

            <div className="text-4xl font-bold text-gray-900 mb-8">
               <span className="text-lg font-medium text-gray-500 mr-1">KSh</span>
               {product.price.toLocaleString()}
            </div>

            {/* Custom Description Rendering */}
            <div className="mb-8 flex-1">
               {renderFormattedDescription(product.description)}
            </div>

            <div className="space-y-4 mt-auto pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <ShoppingCart size={22} /> Buy Now
                  </button>
                  <button 
                    onClick={handleShare}
                    className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 size={22} /> Share
                  </button>
              </div>
              <button 
                onClick={handleContactClick}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                <MessageCircle size={24} /> Contact Seller
              </button>
            </div>
            
            {product.seller && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">Sold By</p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600">
                            {product.seller.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 text-sm">{product.seller.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{product.seller.location || 'Location not specified'}</span>
                                {product.seller.phone && (
                                    <>
                                        <span>•</span>
                                        <span>{product.seller.phone}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};