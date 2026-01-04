// src/pages/HistoryPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Types & Interfaces ---

type OrderStatus = 'Draft' | 'Submitted' | 'Fulfilled' | 'Cancelled';

interface OrderHistoryItem {
  order_id: string;
  zoho_salesorder_id: string;
  date: string;
  customer_po: string;
  total_items: number;
  total_quantity: number;
  status: OrderStatus;
}

// --- Mock Data (Order Log) ---

const MOCK_ORDER_HISTORY: OrderHistoryItem[] = [
  {
    order_id: 'SO-8892',
    zoho_salesorder_id: 'zcRm-9921',
    date: '2025-01-03',
    customer_po: 'PO-2025-001',
    total_items: 4,
    total_quantity: 120,
    status: 'Submitted',
  },
  {
    order_id: 'SO-8845',
    zoho_salesorder_id: 'zcRm-8812',
    date: '2024-12-15',
    customer_po: 'DEC-RESTOCK',
    total_items: 8,
    total_quantity: 450,
    status: 'Fulfilled',
  },
  {
    order_id: 'SO-8810',
    zoho_salesorder_id: 'zcRm-8100',
    date: '2024-11-20',
    customer_po: 'N/A',
    total_items: 2,
    total_quantity: 24,
    status: 'Fulfilled',
  },
  {
    order_id: 'DR-0021',
    zoho_salesorder_id: 'draft_local',
    date: '2024-11-05',
    customer_po: 'PENDING-AUTH',
    total_items: 12,
    total_quantity: 500,
    status: 'Draft',
  },
];

const HistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Helper for Status Badge Styles
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Fulfilled':
        return 'bg-slate-800 text-slate-100 border-slate-700';
      case 'Draft':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. Industrial Header */}
      <div className="flex-none bg-slate-900 shadow-md z-20">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* Back Button */}
            <button 
              onClick={() => navigate('/catalog')}
              className="mr-3 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Back to Catalog"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight uppercase">Order Log</h1>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                ACCT: {user?.zohoContactId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Order List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {MOCK_ORDER_HISTORY.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-slate-900 font-bold text-lg">No Orders Found</h3>
            <p className="text-slate-500 text-sm mb-6">You haven't placed any orders yet.</p>
            <button 
              onClick={() => navigate('/catalog')}
              className="px-6 py-3 bg-slate-900 text-white font-bold text-sm uppercase rounded shadow hover:bg-slate-800"
            >
              Start Ordering
            </button>
          </div>
        ) : (
          MOCK_ORDER_HISTORY.map((order) => (
            <div 
              key={order.order_id} 
              className="bg-white border border-slate-200 rounded shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {order.order_id}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    PO: <span className="text-slate-600 font-bold">{order.customer_po}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-slate-500 block">
                    {order.date}
                  </span>
                </div>
              </div>

              {/* Card Body (Summary) */}
              <div className="px-4 py-3 bg-slate-50/50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Total Lines</span>
                  <span className="font-mono font-bold text-slate-800">{order.total_items}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-slate-500 font-medium">Total Volume</span>
                  <span className="font-mono font-bold text-slate-800">{order.total_quantity} <span className="text-[10px] text-slate-400 font-normal uppercase">UNITS</span></span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="px-4 py-3 flex space-x-3 border-t border-slate-100">
                <button 
                  className="flex-1 h-11 flex items-center justify-center border border-slate-300 text-slate-600 font-bold text-xs uppercase tracking-wide rounded hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reorder All
                </button>
                <button 
                  className="flex-1 h-11 flex items-center justify-center bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wide rounded hover:bg-slate-200 transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;