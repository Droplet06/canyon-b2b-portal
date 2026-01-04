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
  total_amount_display?: string; // Optional price if we wanted to show it
  status: OrderStatus;
  preview_items: string[]; // List of item names for the snippet view
}

// --- Mock Data (Enriched with Item Previews) ---

const MOCK_ORDER_HISTORY: OrderHistoryItem[] = [
  {
    order_id: 'SO-8892',
    zoho_salesorder_id: 'zcRm-9921',
    date: 'Jan 03, 2025',
    customer_po: 'PO-2025-001',
    total_items: 4,
    status: 'Submitted',
    preview_items: ['700ml PP Cup', '90mm Dome Lid', '33oz Rect Container', 'Boba Straws']
  },
  {
    order_id: 'SO-8845',
    zoho_salesorder_id: 'zcRm-8812',
    date: 'Dec 15, 2024',
    customer_po: 'DEC-RESTOCK',
    total_items: 8,
    status: 'Fulfilled',
    preview_items: ['White Napkin 2-Ply', 'Heavy Duty Fork', 'Heavy Duty Spoon', 'CA #1 Take Out Box']
  },
  {
    order_id: 'SO-8810',
    zoho_salesorder_id: 'zcRm-8100',
    date: 'Nov 20, 2024',
    customer_po: 'N/A',
    total_items: 2,
    status: 'Fulfilled',
    preview_items: ['Cane Sugar Syrup', 'Botan Rice Calrose']
  },
  {
    order_id: 'DR-0021',
    zoho_salesorder_id: 'draft_local',
    date: 'Nov 05, 2024',
    customer_po: 'PENDING-AUTH',
    total_items: 12,
    status: 'Draft',
    preview_items: ['Chicken Steak Coating', 'Tonkatsu Sauce', 'Atsuyaki Tamago']
  },
];

const HistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Helper: Status Styles (Semantic & Readable)
  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'; // Green: Good/Sent
      case 'Fulfilled':
        return 'bg-blue-100 text-blue-800 border-blue-200'; // Blue: Complete/Official
      case 'Draft':
        return 'bg-amber-100 text-amber-800 border-amber-200'; // Orange: Warning/Incomplete
      case 'Cancelled':
        return 'bg-slate-100 text-slate-500 border-slate-200'; // Gray: Inactive
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  // Helper: Status Label (Human Readable)
  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'Submitted': return 'Sent to Warehouse';
      case 'Fulfilled': return 'Completed';
      case 'Draft': return 'Draft Saved';
      default: return status;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. Header (Consistent Industrial Theme) */}
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
              <p className="text-xs text-slate-400">
                Past purchases for {user?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Scrollable List */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {MOCK_ORDER_HISTORY.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6 text-slate-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-slate-900 font-bold text-xl mb-2">No Past Orders</h3>
            <p className="text-slate-500 text-base max-w-xs mx-auto mb-8">
              You haven't placed any orders yet. Visit the catalog to start.
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
            {MOCK_ORDER_HISTORY.map((order) => (
              <div 
                key={order.order_id} 
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
              >
                {/* Card Header: Date & Status */}
                <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-start bg-slate-50/30">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {order.date}
                    </h3>
                    <div className="flex items-center mt-1 space-x-2 text-sm text-slate-500">
                      <span>Order #: <span className="font-mono font-medium text-slate-700">{order.order_id}</span></span>
                      {order.customer_po && order.customer_po !== 'N/A' && (
                        <>
                          <span className="text-slate-300">|</span>
                          <span>PO: <span className="font-medium text-slate-700">{order.customer_po}</span></span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getStatusStyle(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                {/* Card Content: Item Snippet */}
                <div className="px-5 py-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                    Includes {order.total_items} Items:
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {order.preview_items.slice(0, 3).join(', ')}
                    {order.preview_items.length > 3 && (
                      <span className="text-slate-400 font-medium"> + {order.total_items - 3} more...</span>
                    )}
                  </p>
                </div>

                {/* Card Actions: Large, clear buttons */}
                <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                  <button 
                    className="flex-1 h-12 flex items-center justify-center bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm"
                  >
                    View Receipt
                  </button>
                  <button 
                    onClick={() => navigate('/catalog')} // Logic would eventually pre-fill cart
                    className="flex-1 h-12 flex items-center justify-center bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-md"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reorder This
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;