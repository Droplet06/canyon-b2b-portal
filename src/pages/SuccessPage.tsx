// src/pages/SuccessPage.tsx

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  customerPO?: string;
}

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // Generate current date for the receipt look
  const orderDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Generate a mock Order Reference ID for visual confirmation
  const orderRef = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 font-sans">
      
      {/* Receipt Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        
        {/* Status Header */}
        <div className="bg-slate-900 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight uppercase">
            Order Submitted
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Your draft has been sent to the warehouse.
          </p>
        </div>

        {/* Order Details (Industrial Manifest Style) */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-100 rounded p-4">
            
            {/* Reference Row */}
            <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ref ID
              </span>
              <span className="text-sm font-mono font-bold text-slate-800">
                {orderRef}
              </span>
            </div>

            {/* Date Row */}
            <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Date
              </span>
              <span className="text-sm font-mono font-medium text-slate-700">
                {orderDate}
              </span>
            </div>

            {/* PO Row */}
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Customer PO
              </span>
              <span className="text-sm font-mono font-bold text-slate-900 bg-white px-2 py-0.5 border border-slate-200 rounded">
                {state?.customerPO || 'N/A'}
              </span>
            </div>
          </div>

          <p className="text-xs text-center text-slate-400 leading-relaxed px-4">
            A confirmation email has been sent to your registered address. Final invoice will follow upon fulfillment.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
          <button
            onClick={() => navigate('/catalog')}
            className="w-full py-4 rounded-md bg-slate-900 text-white font-bold text-sm uppercase tracking-wide shadow-sm hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Return to Catalog
          </button>
          
          <button
            onClick={() => navigate('/history')}
            className="w-full py-4 rounded-md bg-white text-slate-600 font-bold text-sm uppercase tracking-wide border border-slate-300 shadow-sm hover:bg-slate-50 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            View Order History
          </button>
        </div>

      </div>
    </div>
  );
};

export default SuccessPage;