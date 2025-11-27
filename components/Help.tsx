
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Mail, FileText } from 'lucide-react';

const faqs = [
  {
    question: "How do I list a product for sale?",
    answer: "To list a product, click on the 'Sell Product' button in the navigation menu. Fill in the required details like name, price, category, and description. You can also use our AI tool to generate a description for you."
  },
  {
    question: "Is there a fee for posting jobs?",
    answer: "Currently, posting jobs on Nexus Market is free for all registered users. We plan to introduce premium features for recruiters in the future."
  },
  {
    question: "How can I contact a seller?",
    answer: "You can contact a seller by clicking the 'View Details' button on their product listing. This will open the product page where you can find the 'Contact Seller' option."
  },
  {
    question: "Can I edit my profile information?",
    answer: "Yes, navigate to the 'Profile' section from the menu. Click on the 'Edit Profile' button to update your personal details, bio, and profile picture."
  }
];

export const Help: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
       <header className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">How can we help?</h1>
        <p className="text-gray-500 mt-2">Search our knowledge base or get in touch with support.</p>
        
        <div className="mt-6 max-w-lg mx-auto relative">
           <input 
             type="text" 
             placeholder="Search for answers..."
             className="w-full pl-6 pr-4 py-3.5 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
           />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <MessageCircle size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-500">Chat with our support team in real-time.</p>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Mail size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-500">Get a response within 24 hours.</p>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <FileText size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Documentation</h3>
            <p className="text-sm text-gray-500">Read detailed guides and tutorials.</p>
         </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
         </div>
         <div>
            {faqs.map((faq, index) => (
               <div key={index} className="border-b border-gray-100 last:border-0">
                  <button 
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                     <span className="font-medium text-gray-900">{faq.question}</span>
                     {openIndex === index ? <ChevronUp size={20} className="text-indigo-600" /> : <ChevronDown size={20} className="text-gray-400" />}
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-48' : 'max-h-0'}`}
                  >
                     <p className="px-6 pb-6 text-gray-600 leading-relaxed text-sm">
                        {faq.answer}
                     </p>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};
