// src/config/mockData.js
import { serverTimestamp } from 'firebase/firestore';

export const mockVendors = [
  "Stark Industries", 
  "Wayne Enterprises", 
  "Cyberdyne Systems", 
  "Acme Corporation", 
  "Globex Corporation"
];

export const mockItems = [
  { desc: "Quantum Core", price: 2500 },
  { desc: "Plasma Injector", price: 1200 },
  { desc: "Hyperdrive Coolant", price: 350 },
  { desc: "Nanobot Swarm", price: 7800 },
  { desc: "Carbonite Plating", price: 4500 },
];

export const generateMockInvoiceData = (fileName) => {
  const vendor = mockVendors[Math.floor(Math.random() * mockVendors.length)];
  const invoiceNumber = `INV-${Math.floor(Math.random() * 90000) + 10000}`;
  const date = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  
  let subtotal = 0;
  const lineItems = Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => {
    const item = mockItems[Math.floor(Math.random() * mockItems.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const itemSubtotal = item.price * quantity;
    subtotal += itemSubtotal;
    return { 
      description: item.desc, 
      quantity, 
      price: item.price, 
      subtotal: itemSubtotal 
    };
  });

  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const fileURL = `https://placehold.co/800x1100/FFFFFF/000000?text=${encodeURIComponent(`Invoice\n${fileName}`)}`;

  return {
    vendorName: vendor,
    invoiceNumber,
    date,
    lineItems,
    subtotal,
    tax,
    total,
    fileName,
    fileURL,
    status: ['Paid', 'Pending', 'Overdue'][Math.floor(Math.random() * 3)],
    createdAt: serverTimestamp(),
  };
};