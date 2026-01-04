// src/context/OrderContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Types ---

export interface LineItem {
  item_id: string;
  name: string; // Snapshotted for history display
  sku: string;  // Snapshotted for history display
  quantity: number;
  unit: string;
}

export interface Order {
  order_id: string;       // Internal ID (e.g., SO-1001)
  zoho_salesorder_id?: string;
  date: string;           // Human readable or ISO
  customer_po: string;
  line_items: LineItem[];
  status: 'Draft' | 'Submitted' | 'Fulfilled' | 'Cancelled';
  customer_id: string;    // Zoho Contact ID
}

interface OrderContextType {
  activeCart: Record<string, number>; // { item_id: quantity }
  orderHistory: Order[];
  addToCart: (itemId: string, quantity: number) => void;
  submitOrder: (orderData: Order) => void;
  reorder: (orderId: string) => void;
  clearCart: () => void;
}

// --- Initial Mock History (Updated to 2026) ---

const INITIAL_HISTORY: Order[] = [
  {
    order_id: 'SO-8892',
    zoho_salesorder_id: 'zcRm-9921',
    date: 'Jan 03, 2026',
    customer_po: 'PO-2026-001',
    status: 'Submitted',
    customer_id: 'z_contact_456789',
    line_items: [
      { item_id: '202', name: '700ml Cup (500 pcs)', sku: 'CUP-PP-700', quantity: 5, unit: 'box' },
      { item_id: '222', name: 'CA 90 PP Cup Lid (1000pcs)', sku: 'LID-PP-90', quantity: 3, unit: 'box' },
      { item_id: '217', name: 'CA 36 oz Black Bowl w/ Clear Lid', sku: 'BOWL-BLK-36', quantity: 2, unit: 'box' },
      { item_id: '214', name: 'CA 23cm Bamboo Chopsticks', sku: 'CUT-CHOP-23', quantity: 10, unit: 'box' }
    ]
  },
  {
    order_id: 'SO-8845',
    zoho_salesorder_id: 'zcRm-8812',
    date: 'Dec 15, 2025',
    customer_po: 'DEC-RESTOCK',
    status: 'Fulfilled',
    customer_id: 'z_contact_456789',
    line_items: [
      { item_id: '208', name: 'CA #2 White Paper Take Out Box', sku: 'CA-BOX-2', quantity: 20, unit: 'box' },
      { item_id: '219', name: 'CA 64 oz Deli Container', sku: 'DELI-CONT-64', quantity: 5, unit: 'box' }
    ]
  }
];

// --- Context & Provider ---

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [activeCart, setActiveCart] = useState<Record<string, number>>({});
  const [orderHistory, setOrderHistory] = useState<Order[]>(INITIAL_HISTORY);
  const navigate = useNavigate();

  // Update Cart Logic
  const addToCart = (itemId: string, quantity: number) => {
    setActiveCart((prev) => {
      if (quantity <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: quantity };
    });
  };

  const clearCart = () => setActiveCart({});

  // Submit Order Logic
  const submitOrder = (orderData: Order) => {
    // Prepend to history so it shows at the top
    setOrderHistory((prev) => [orderData, ...prev]);
    clearCart();
  };

  // Reorder Logic
  const reorder = (orderId: string) => {
    const orderToCopy = orderHistory.find((o) => o.order_id === orderId);
    if (!orderToCopy) return;

    // Convert line items back to simple cart state { item_id: quantity }
    const newCart: Record<string, number> = {};
    orderToCopy.line_items.forEach((item) => {
      newCart[item.item_id] = item.quantity;
    });

    setActiveCart(newCart);
    navigate('/catalog');
  };

  return (
    <OrderContext.Provider value={{ activeCart, orderHistory, addToCart, submitOrder, reorder, clearCart }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};