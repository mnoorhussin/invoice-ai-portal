// src/hooks/useInvoices.js
import { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, doc } from 'firebase/firestore';

export const useInvoices = (userId) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !db) {
      console.log('No userId or database available, skipping invoice loading');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Create reference to user's invoices collection
      const invoicesRef = collection(db, 'users', userId, 'invoices');
      const q = query(invoicesRef, orderBy('createdAt', 'desc'));
      
      console.log('Setting up Firestore listener for user:', userId);
      console.log('Database instance:', db);
      console.log('Auth state:', auth?.currentUser);
      
      // Set up real-time listener
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const invoiceList = [];
          snapshot.forEach((doc) => {
            invoiceList.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          console.log(`Loaded ${invoiceList.length} invoices from Firestore`);
          setInvoices(invoiceList);
          setLoading(false);
        },
        (err) => {
          console.error("Error loading invoices from Firestore:", err);
          setError(err);
          setLoading(false);
          
          // Fallback to localStorage if Firestore fails
          loadFromLocalStorage();
        }
      );

      // Cleanup function
      return () => {
        console.log('Cleaning up Firestore listener');
        unsubscribe();
      };
      
    } catch (err) {
      console.error("Error setting up Firestore listener:", err);
      setError(err);
      setLoading(false);
      
      // Fallback to localStorage
      loadFromLocalStorage();
    }

    function loadFromLocalStorage() {
      try {
        console.log('Falling back to localStorage');
        const storageKey = `invoices_${userId}`;
        const storedInvoices = JSON.parse(localStorage.getItem(storageKey) || '[]');
        setInvoices(storedInvoices);
        setLoading(false);
        console.log(`Loaded ${storedInvoices.length} invoices from localStorage`);
      } catch (err) {
        console.error("Error loading from localStorage:", err);
        setError(err);
        setLoading(false);
      }
    }
  }, [userId]);

  const addInvoice = async (invoiceData) => {
    if (!userId) {
      console.log('No userId available, cannot add invoice');
      return { success: false, error: 'User not authenticated' };
    }

    // Add timestamp and user ID to the invoice data
    const invoiceWithMetadata = {
      ...invoiceData,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userId
    };

    // Try Firestore first
    if (db) {
      try {
        console.log('Saving invoice to Firestore:', invoiceWithMetadata);
        
        const invoicesRef = collection(db, 'users', userId, 'invoices');
        const docRef = await addDoc(invoicesRef, invoiceWithMetadata);
        
        console.log('Invoice added successfully to Firestore with ID:', docRef.id);
        return { success: true, id: docRef.id };
        
      } catch (err) {
        console.error("Error adding invoice to Firestore:", err);
        console.log('Falling back to localStorage...');
        
        // Fall back to localStorage if Firestore fails
        return await saveToLocalStorage(invoiceWithMetadata);
      }
    } else {
      console.log('Firestore not available, using localStorage');
      return await saveToLocalStorage(invoiceWithMetadata);
    }

    async function saveToLocalStorage(invoice) {
      try {
        // Convert dates to ISO strings for localStorage
        const invoiceForStorage = {
          ...invoice,
          id: Date.now().toString(),
          createdAt: invoice.createdAt.toISOString(),
          updatedAt: invoice.updatedAt.toISOString()
        };
        
        const storageKey = `invoices_${userId}`;
        const existingInvoices = JSON.parse(localStorage.getItem(storageKey) || '[]');
        existingInvoices.unshift(invoiceForStorage);
        localStorage.setItem(storageKey, JSON.stringify(existingInvoices));
        
        // Update local state
        setInvoices(existingInvoices);
        
        console.log('Invoice added successfully to localStorage with ID:', invoiceForStorage.id);
        return { success: true, id: invoiceForStorage.id };
      } catch (err) {
        console.error("Error adding invoice to localStorage:", err);
        return { success: false, error: err.message };
      }
    }
  };

  return { invoices, loading, error, addInvoice };
};