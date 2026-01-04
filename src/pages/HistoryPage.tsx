// src/pages/HistoryPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrder, Order } from '../context/OrderContext';

const HistoryPage = () => {
  const { user } = useAuth();
  const { orderHistory, reorder } = useOrder();
  const navigate = useNavigate();

  // Local state for "View Details" Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Helper: Status Styles
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Fulfilled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Draft': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. Header */}
      <div className="flex-none bg-slate-900 shadow-md z-20">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/catalog')}
              className="p-2 -ml-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Back to Catalog"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Order History</h1>
              <p className="text-xs text-slate-400">Past purchases for {user?.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Scrollable List */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {orderHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6 text-slate-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-slate-900 font-bold text-xl mb-2">No Past Orders</h3>
            <p className="text-slate-500 text-base max-w-xs mx-auto mb-8">
              Orders you submit will appear here.
            </p>
            <button 
              onClick={() => navigate('/catalog')}
              className="w-full max-w-xs py-4 bg-slate-900 text-white font-bold text-sm uppercase tracking-wide rounded-lg shadow-lg hover:bg-slate-800 transition-all"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {orderHistory.map((order) => {
              const totalQuantity = order.line_items.reduce((acc, item) => acc + item.quantity, 0);
              const previewNames = order.line_items.map(item => item.name);

              return (
                <div key={order.order_id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  {/* Card Header */}
                  <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-start bg-slate-50/30">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{order.date}</h3>
                      <div className="flex items-center mt-1 space-x-2 text-sm text-slate-500">
                        <span>Ref: <span className="font-mono font-medium text-slate-700">{order.order_id}</span></span>
                        {order.customer_po && (
                          <>
                            <span className="text-slate-300">|</span>
                            <span>PO: <span className="font-medium text-slate-700">{order.customer_po}</span></span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Card Snippet */}
                  <div className="px-5 py-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                      Contains {totalQuantity} Items:
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {previewNames.slice(0, 3).join(', ')}
                      {previewNames.length > 3 && (
                        <span className="text-slate-400 font-medium"> + {previewNames.length - 3} more...</span>
                      )}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 h-12 flex items-center justify-center bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      View Receipt
                    </button>
                    <button 
                      onClick={() => reorder(order.order_id)}
                      className="flex-1 h-12 flex items-center justify-center bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-md"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reorder This
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 animate-slide-up">
          <div className="flex-none bg-slate-900 px-4 py-4 flex justify-between items-center shadow-md">
            <h2 className="text-lg font-bold text-white tracking-tight uppercase">Order Details</h2>
            <button 
              onClick={() => setSelectedOrder(null)} 
              className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider border border-slate-600 px-3 py-1 rounded hover:border-white transition-colors"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {/* Info Card */}
             <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
                <div className="flex justify-between border-b border-slate-100 pb-3 mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Date</span>
                  <span className="text-sm font-bold text-slate-900">{selectedOrder.date}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3 mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Order ID</span>
                  <span className="text-sm font-mono font-bold text-slate-900">{selectedOrder.order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">PO Number</span>
                  <span className="text-sm font-bold text-slate-900">{selectedOrder.customer_po || 'N/A'}</span>
                </div>
             </div>

             {/* Line Items */}
             <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  Itemized List
                </div>
                <ul className="divide-y divide-slate-100">
                  {selectedOrder.line_items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center py-3 px-4">
                      <div className="pr-4">
                         <div className="font-mono text-xs font-bold text-slate-500">{item.sku}</div>
                         <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                      </div>
                      <div className="text-right">
                         <span className="block text-lg font-bold text-slate-900">{item.quantity}</span>
                         <span className="block text-[10px] font-bold text-slate-400 uppercase">{item.unit}</span>
                      </div>
                    </li>
                  ))}
                </ul>
             </div>
          </div>
          
          <div className="flex-none bg-white border-t border-slate-200 p-4 safe-area-bottom">
             <button 
               onClick={() => {
                 reorder(selectedOrder.order_id);
                 setSelectedOrder(null);
               }}
               className="w-full h-12 rounded font-bold text-white bg-slate-900 shadow-md hover:bg-slate-800 transition-colors uppercase tracking-wide flex justify-center items-center"
             >
               Reorder These Items
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;