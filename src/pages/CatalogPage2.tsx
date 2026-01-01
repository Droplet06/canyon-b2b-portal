// src/pages/CatalogPage.tsx

import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

// --- Types & Interfaces ---

interface ZohoItem {
  item_id: string;
  name: string;
  sku: string;
  stock_on_hand: number; // Data retained but ignored in UI/Logic
  unit: string; 
  rate: number; // Selling price (Hidden in UI, used for backend payload)
}

// --- Real Business Data (Cleaned) ---

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

// IDs matching the new Real Data
const MOCK_PAST_ORDER_IDS = ['201', '207', '211', '217', '220', '202']; 

const CatalogPage = () => {
  const { user } = useAuth(); // Access user data for payload
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'buy-again'>('all');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Data State
  const [orderDraft, setOrderDraft] = useState<Record<string, number>>({});
  const [customerPO, setCustomerPO] = useState('');

  // --- Logic ---

  // Filter Logic
  const filteredItems = useMemo(() => {
    // 1. First, filter by View Mode (All vs Buy Again)
    let items = MOCK_INVENTORY;
    if (viewMode === 'buy-again') {
      items = items.filter(item => MOCK_PAST_ORDER_IDS.includes(item.item_id));
    }

    // 2. Second, apply text search to the resulting list
    const lowerTerm = searchTerm.toLowerCase();
    return items.filter((item) => 
      item.name.toLowerCase().includes(lowerTerm) || 
      item.sku.toLowerCase().includes(lowerTerm)
    );
  }, [searchTerm, viewMode]);

  // Stepper Logic
  const handleIncrement = (itemId: string) => {
    // Unrestricted increment (Backorder allowed)
    setOrderDraft(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const handleDecrement = (itemId: string) => {
    setOrderDraft(prev => {
      const current = prev[itemId] || 0;
      if (current <= 0) return prev; 
      const updated = current - 1;
      if (updated === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: updated };
    });
  };

  // Submission Logic
  const submitOrder = async () => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      // 1. Build Line Items
      const lineItems = Object.entries(orderDraft).map(([itemId, quantity]) => {
        const item = MOCK_INVENTORY.find(i => i.item_id === itemId);
        return {
          item_id: itemId,
          quantity: quantity,
          unit: item?.unit || 'unit'
        };
      });

      // 2. Construct Payload
      const payload = {
        customer_id: user.zohoContactId,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        line_items: lineItems,
        custom_fields: [
          {
            label: "Customer PO",
            value: customerPO
          }
        ]
      };

      // 3. Mock Network Request
      console.log('>>> SUBMITTING ORDER TO ZOHO BOOKS:', JSON.stringify(payload, null, 2));
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

      // 4. Success Handling
      setOrderDraft({});
      setCustomerPO('');
      setIsReviewOpen(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Derived Totals
  const totalItemsSelected = Object.values(orderDraft).reduce((a, b) => a + b, 0);

  // --- Render ---

  return (
    <div className="flex flex-col h-screen bg-gray-100 relative">
      
      {/* 1. Header, Search & Filters (Fixed Top) */}
      <div className="flex-none bg-white shadow-sm z-10">
        <div className="px-4 py-3 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-800">Product Catalog</h1>
          <p className="text-xs text-gray-500">
            Welcome, {user?.name}
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <input
            type="text"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            placeholder="Search by Name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* View Switcher Tabs */}
        <div className="flex w-full bg-white border-b border-gray-200">
          <button
            onClick={() => setViewMode('all')}
            className={`flex-1 py-3 text-sm font-medium text-center focus:outline-none transition-colors ${
              viewMode === 'all' 
                ? 'bg-gray-900 text-white shadow-inner' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setViewMode('buy-again')}
            className={`flex-1 py-3 text-sm font-medium text-center focus:outline-none transition-colors flex items-center justify-center ${
              viewMode === 'buy-again' 
                ? 'bg-gray-900 text-white shadow-inner' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className={`w-4 h-4 mr-1 ${viewMode === 'buy-again' ? 'text-yellow-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Buy Again
          </button>
        </div>
      </div>

      {/* 2. Scrollable List */}
      <div className="flex-1 overflow-y-auto pb-24">
        {filteredItems.length === 0 ? (
           <div className="p-8 text-center text-gray-500">
             {viewMode === 'buy-again' 
               ? "No past purchases found matching your search." 
               : "No items found."}
           </div>
        ) : (
          <ul className="divide-y divide-gray-200 bg-white">
            {filteredItems.map((item) => {
              const qty = orderDraft[item.item_id] || 0;

              return (
                <li key={item.item_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50">
                   <div className="flex-1 mb-3 sm:mb-0 pr-4">
                    <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                    <div className="mt-1 flex items-center text-xs space-x-3">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 font-mono">
                        {item.sku}
                      </span>
                      {/* Stock display removed per requirements */}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button 
                      onClick={() => handleDecrement(item.item_id)} 
                      className="w-10 h-10 flex items-center justify-center rounded-md bg-white border border-gray-200 shadow-sm disabled:opacity-50 disabled:bg-gray-50 text-gray-700" 
                      disabled={qty === 0}
                    >
                      -
                    </button>
                    
                    <div className="flex flex-col items-center justify-center w-16 mx-1">
                      <span className={`text-base font-bold ${qty > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                        {qty}
                      </span>
                      <span className="text-[10px] uppercase text-gray-500 font-medium tracking-wider">
                        {item.unit}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleIncrement(item.item_id)} 
                      className="w-10 h-10 flex items-center justify-center rounded-md bg-white border border-gray-200 shadow-sm text-gray-700 active:bg-gray-100"
                      // Always enabled for backorders
                    >
                      +
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 3. Footer Button */}
      <div className="flex-none bg-white border-t border-gray-200 p-4 safe-area-bottom">
        <button 
          onClick={() => setIsReviewOpen(true)}
          className={`w-full py-3 px-4 rounded-md font-bold text-white shadow-sm transition-all ${
            totalItemsSelected > 0 ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={totalItemsSelected === 0}
        >
          {totalItemsSelected > 0 ? `Review Order (${totalItemsSelected} Items)` : 'Select Items to Order'}
        </button>
      </div>

      {/* 4. SUCCESS TOAST */}
      {showSuccess && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-md shadow-lg flex items-center justify-center animate-bounce-in">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span className="font-bold">Order Draft Created Successfully!</span>
        </div>
      )}

      {/* 5. REVIEW ORDER MODAL */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-100 animate-slide-up">
          {/* Modal Header */}
          <div className="flex-none bg-white shadow-sm px-4 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Review Order</h2>
            <button onClick={() => setIsReviewOpen(false)} className="text-gray-500 hover:text-gray-700 font-medium text-sm">
              Close
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* PO Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <label htmlFor="po_number" className="block text-sm font-medium text-gray-700 mb-1">
                Customer PO # <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                id="po_number"
                placeholder="e.g. PO-2025-001"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                value={customerPO}
                onChange={(e) => setCustomerPO(e.target.value)}
              />
            </div>

            {/* Line Items Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Order Summary
              </div>
              <ul className="divide-y divide-gray-200">
                {Object.entries(orderDraft).map(([itemId, qty]) => {
                  const item = MOCK_INVENTORY.find(i => i.item_id === itemId);
                  if (!item) return null;
                  return (
                    <li key={itemId} className="flex justify-between py-3 px-4">
                      <div className="pr-4">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.sku}</p>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <p className="text-sm font-bold text-gray-900">{qty} <span className="text-xs font-normal text-gray-500">{item.unit}</span></p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Total Items</span>
                <span className="text-lg font-bold text-gray-900">{totalItemsSelected}</span>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex-none bg-white border-t border-gray-200 p-4 safe-area-bottom space-y-3">
             <button 
              onClick={submitOrder}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-md font-bold text-white bg-blue-600 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Order...
                </>
              ) : (
                'Confirm & Submit Order'
              )}
            </button>
            <button 
              onClick={() => setIsReviewOpen(false)}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-md font-medium text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;