import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({
    message: '',
    visible: false,
    type: 'success'
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, visible: true, type });
    setTimeout(() => {
      setToast(t => ({ ...t, visible: false }));
    }, 3000);
  };

  return { toast, showToast };
};