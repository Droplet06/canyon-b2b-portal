// src/pages/CatalogPage.tsx

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrder, Order } from '../context/OrderContext';

// --- Types ---

interface ZohoItem {
  item_id: string;
  name: string;
  sku: string;
  stock_on_hand: number;
  unit: string; 
  rate: number;
}

// --- Real Business Data (Inventory Source of Truth) ---

const MOCK_INVENTORY: ZohoItem[] = [
  { item_id: '201', name: '33 oz 3 Compartment Black Rectangle w/ Clear Lid (150 pcs)', sku: 'CONT-BLK-33-3', stock_on_hand: 12, unit: 'box', rate: 44.65 },
  { item_id: '202', name: '700ml Cup (500 pcs)', sku: 'CUP-PP-700', stock_on_hand: 12, unit: 'box', rate: 50.00 },
  { item_id: '203', name: 'Ahjikan Atsuyaki Tamago 17.60oz', sku: 'FOOD-TAMAGO', stock_on_hand: 0, unit: 'pcs', rate: 6.11 },
  { item_id: '204', name: 'Ajishima Fuikake Nori Komi 1.1lb', sku: 'FOOD-NORI', stock_on_hand: 0, unit: 'pcs', rate: 19.78 },
  { item_id: '205', name: 'Botan Rice Calrose Kraft 50lb', sku: 'RICE-CAL-50', stock_on_hand: 0, unit: 'pcs', rate: 28.89 },
  { item_id: '206', name: 'Bulldog Tonkatsu Sc Pet-Btl 60.9oz', sku: 'SAUCE-TONK', stock_on_hand: 0, unit: 'pcs', rate: 10.33 },
  { item_id: '207', name: 'CA #1 White Paper Take Out Box (450pcs)', sku: 'CA-BOX-1', stock_on_hand: 13, unit: 'box', rate: 40.00 },
  { item_id: '208', name: 'CA #2 White Paper Take Out Box (200pcs)', sku: 'CA-BOX-2', stock_on_hand: 0, unit: 'box', rate: 34.00 },
  { item_id: '209', name: 'CA #4 White Paper Take Out Box (160pcs)', sku: 'CA-BOX-4', stock_on_hand: 13, unit: 'box', rate: 48.40 },
  { item_id: '210', name: 'CA #8 White Paper Take Out Box (300pcs)', sku: 'CA-BOX-8', stock_on_hand: 13, unit: 'box', rate: 45.00 },
  { item_id: '211', name: 'CA 12 Kraft Paper Bag (250pcs)', sku: 'BAG-KRAFT-12', stock_on_hand: 24, unit: 'box', rate: 50.00 },
  { item_id: '212', name: 'CA 12 oz Deli Container (240 pcs)', sku: 'DELI-CONT-12', stock_on_hand: 4, unit: 'box', rate: 20.75 },
  { item_id: '213', name: 'CA 16 oz Deli Container (240 pcs)', sku: 'DELI-CONT-16', stock_on_hand: 2, unit: 'box', rate: 23.75 },
  { item_id: '214', name: 'CA 23cm Bamboo Chopsticks Twin (2000pcs)', sku: 'CUT-CHOP-23', stock_on_hand: 10, unit: 'box', rate: 45.20 },
  { item_id: '215', name: 'CA 24 oz Deli Container (240 pcs)', sku: 'DELI-CONT-24', stock_on_hand: 11, unit: 'box', rate: 28.75 },
  { item_id: '216', name: 'CA 32 oz Deli Container (240 pcs)', sku: 'DELI-CONT-32', stock_on_hand: 5, unit: 'box', rate: 34.75 },
  { item_id: '217', name: 'CA 36 oz Black Bowl w/ Clear Lid (150 pcs)', sku: 'BOWL-BLK-36', stock_on_hand: 29, unit: 'box', rate: 22.80 },
  { item_id: '218', name: 'CA 6.5 Heavy Duty Spoon (1000pcs)', sku: 'CUT-SPN-HD', stock_on_hand: 8, unit: 'box', rate: 17.79 },
  { item_id: '219', name: 'CA 64 oz Deli Container (120 pcs)', sku: 'DELI-CONT-64', stock_on_hand: 15, unit: 'box', rate: 45.00 },
  { item_id: '220', name: 'CA 6lb Kraft Paper Bag (1000pcs)', sku: 'BAG-KRAFT-6', stock_on_hand: 37, unit: 'box', rate: 25.30 },
  { item_id: '221', name: 'CA 8 oz Deli Container (240 pcs)', sku: 'DELI-CONT-8', stock_on_hand: 2, unit: 'box', rate: 19.25 },
  { item_id: '222', name: 'CA 90 PP Cup Lid (1000pcs)', sku: 'LID-PP-90', stock_on_hand: 18, unit: 'box', rate: 40.00 },
  { item_id: '223', name: 'CA Dinner Napkin 16.35*13.86 (3000pcs)', sku: 'NAP-DIN-LG', stock_on_hand: 16, unit: 'box', rate: 40.00 },
  { item_id: '224', name: 'Cane sugar syrup (25kg)', sku: 'SYRUP-CANE', stock_on_hand: 0, unit: 'pcs', rate: 48.00 },
  { item_id: '225', name: 'Chicken Steak Coating 1kg*20bag', sku: 'FOOD-CHK-COAT', stock_on_hand: 0, unit: 'box', rate: 75.00 }
];

const MOCK_PAST_ORDER_IDS = ['201', '207', '211', '217', '220', '202']; 

const CatalogPage = () => {
  const { user } = useAuth();
  const { activeCart, addToCart, submitOrder: contextSubmitOrder } = useOrder();
  const navigate = useNavigate();
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'buy-again'>('all');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Local Data State
  const [customerPO, setCustomerPO] = useState('');

  // --- Logic ---

  const filteredItems = useMemo(() => {
    let items = MOCK_INVENTORY;
    if (viewMode === 'buy-again') {
      items = items.filter(item => MOCK_PAST_ORDER_IDS.includes(item.item_id));
    }
    const lowerTerm = searchTerm.toLowerCase();
    return items.filter((item) => 
      item.name.toLowerCase().includes(lowerTerm) || 
      item.sku.toLowerCase().includes(lowerTerm)
    );
  }, [searchTerm, viewMode]);

  const handleIncrement = (itemId: string) => {
    const currentQty = activeCart[itemId] || 0;
    addToCart(itemId, currentQty + 1);
  };

  const handleDecrement = (itemId: string) => {
    const currentQty = activeCart[itemId] || 0;
    if (currentQty > 0) {
      addToCart(itemId, currentQty - 1);
    }
  };

  const submitOrder = async () => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      // 1. Build Payload & Snapshot Item Details
      const lineItems = Object.entries(activeCart).map(([itemId, quantity]) => {
        const item = MOCK_INVENTORY.find(i => i.item_id === itemId);
        return {
          item_id: itemId,
          name: item?.name || 'Unknown Item', // Snapshot name
          sku: item?.sku || 'N/A',           // Snapshot SKU
          quantity: quantity,
          unit: item?.unit || 'unit'
        };
      });

      const newOrder: Order = {
        order_id: `SO-${Math.floor(1000 + Math.random() * 9000)}`, // Generate Mock ID
        customer_id: user.zohoContactId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), // e.g. Jan 04, 2026
        line_items: lineItems,
        customer_po: customerPO,
        status: 'Submitted'
      };

      console.log('>>> SUBMITTING ORDER TO CONTEXT:', JSON.stringify(newOrder, null, 2));
      
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      // 2. Submit to Context
      contextSubmitOrder(newOrder);

      // 3. Reset UI & Navigate
      setCustomerPO('');
      setIsReviewOpen(false);
      navigate('/success', { state: { customerPO: customerPO } });

    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalItemsSelected = Object.values(activeCart).reduce((a, b) => a + b, 0);

  // --- Render ---

  return (
    <div className="flex flex-col h-screen bg-slate-50 relative font-sans text-slate-900">
      
      {/* 1. Industrial Header */}
      <div className="flex-none bg-slate-900 z-20 shadow-md">
        <div className="px-4 py-4 flex justify-between items-end">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">WAREHOUSE</h1>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              ID: {user?.zohoContactId} | {user?.name.toUpperCase()}
            </p>
          </div>
        </div>
        
        {/* View Switcher */}
        <div className="flex px-2 pb-2">
          <div className="flex w-full bg-slate-800 p-1 rounded">
            <button
              onClick={() => setViewMode('all')}
              className={`flex-1 h-11 flex items-center justify-center text-xs font-bold uppercase tracking-wide rounded-sm transition-all ${
                viewMode === 'all' 
                  ? 'bg-slate-50 text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setViewMode('buy-again')}
              className={`flex-1 h-11 flex items-center justify-center text-xs font-bold uppercase tracking-wide rounded-sm transition-all ${
                viewMode === 'buy-again' 
                  ? 'bg-slate-50 text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className={`w-3 h-3 mr-1.5 ${viewMode === 'buy-again' ? 'text-amber-500' : 'text-slate-500'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Buy Again
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-2 pb-3">
          <input
            type="text"
            className="block w-full h-11 px-3 bg-slate-800 border border-slate-700 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm"
            placeholder="FILTER BY SKU OR NAME..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 2. High-Density List */}
      <div className="flex-1 overflow-y-auto pb-24">
        {filteredItems.length === 0 ? (
           <div className="p-8 text-center">
             <p className="text-slate-400 text-sm font-medium">
               {viewMode === 'buy-again' ? "NO HISTORY FOUND" : "NO ITEMS MATCH FILTER"}
             </p>
           </div>
        ) : (
          <ul className="divide-y divide-slate-200 bg-white shadow-sm">
            {filteredItems.map((item) => {
              const qty = activeCart[item.item_id] || 0;

              return (
                <li key={item.item_id} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 pr-3 overflow-hidden">
                    <div className="flex items-baseline mb-1">
                      <span className="inline-block bg-slate-100 text-slate-600 text-[11px] font-mono font-bold px-1.5 py-0.5 rounded mr-2 border border-slate-200">
                        {item.sku}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800 leading-snug truncate">
                      {item.name}
                    </h3>
                  </div>

                  {/* Stepper */}
                  <div className="flex items-center bg-white rounded border border-slate-300 shadow-sm">
                    <button 
                      onClick={() => handleDecrement(item.item_id)} 
                      className="h-11 w-11 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 border-r border-slate-200 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                      disabled={qty === 0}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="square" strokeLinejoin="miter" d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <div className="flex flex-col items-center justify-center w-14 h-11 bg-slate-50">
                      <span className={`text-sm font-bold leading-none ${qty > 0 ? 'text-slate-900' : 'text-slate-300'}`}>
                        {qty}
                      </span>
                      <span className="text-[9px] uppercase font-black text-slate-400 mt-0.5">
                        {item.unit}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleIncrement(item.item_id)} 
                      className="h-11 w-11 flex items-center justify-center text-slate-900 hover:bg-slate-100 active:bg-slate-200 border-l border-slate-200 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="square" strokeLinejoin="miter" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 3. Footer Action */}
      <div className="flex-none bg-white border-t border-slate-200 p-4 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setIsReviewOpen(true)}
          className={`w-full h-12 rounded font-bold text-sm uppercase tracking-wider shadow-md transition-all ${
            totalItemsSelected > 0 
              ? 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-700' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
          disabled={totalItemsSelected === 0}
        >
          {totalItemsSelected > 0 
            ? `Review Manifest (${totalItemsSelected} Items)` 
            : 'Select Items to Proceed'}
        </button>
      </div>

      {/* 4. Review Modal */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 animate-slide-up">
          <div className="flex-none bg-slate-900 px-4 py-4 flex justify-between items-center shadow-md">
            <h2 className="text-lg font-bold text-white tracking-tight uppercase">Order Manifest</h2>
            <button 
              onClick={() => setIsReviewOpen(false)} 
              className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider border border-slate-600 px-3 py-1 rounded hover:border-white transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
              <label htmlFor="po_number" className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Purchase Order (Optional)
              </label>
              <input
                type="text"
                id="po_number"
                placeholder="ENTER PO NUMBER"
                className="block w-full h-12 px-3 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm font-mono text-slate-900 bg-slate-50"
                value={customerPO}
                onChange={(e) => setCustomerPO(e.target.value)}
              />
            </div>

            <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Items Selected</span>
              </div>
              <ul className="divide-y divide-slate-100">
                {Object.entries(activeCart).map(([itemId, qty]) => {
                  const item = MOCK_INVENTORY.find(i => i.item_id === itemId);
                  if (!item) return null;
                  return (
                    <li key={itemId} className="flex justify-between items-center py-3 px-4">
                      <div className="pr-4">
                        <div className="font-mono text-xs font-bold text-slate-500">{item.sku}</div>
                        <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                      </div>
                      <div className="text-right">
                        <span className="block text-lg font-bold text-slate-900">{qty}</span>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">{item.unit}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="bg-slate-50 px-4 py-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600 uppercase">Total Count</span>
                <span className="text-xl font-bold text-slate-900">{totalItemsSelected}</span>
              </div>
            </div>
          </div>

          <div className="flex-none bg-white border-t border-slate-200 p-4 safe-area-bottom">
             <button 
              onClick={submitOrder}
              disabled={isSubmitting}
              className="w-full h-12 rounded font-bold text-white bg-slate-900 shadow-md hover:bg-slate-800 active:bg-slate-700 disabled:bg-slate-400 flex justify-center items-center uppercase tracking-wide transition-colors"
            >
              {isSubmitting ? 'Processing...' : 'Confirm & Send Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;