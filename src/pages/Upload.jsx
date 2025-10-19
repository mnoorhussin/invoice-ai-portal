// src/pages/Upload.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../contexts/AuthContext';
import { useInvoices } from '../hooks/useInvoices';
import { useToast } from '../hooks/useToast';
import { useTheme } from '../contexts/ThemeContext';
import { generateMockInvoiceData } from '../config/mockData';
import { Icons } from '../components/common/Icons';
import GlassCard from '../components/Layout/GlassCard';

const Upload = () => {
  const { user } = useAuth();
  const { addInvoice } = useInvoices(user?.uid);
  const { showToast } = useToast();
  const { isDarkMode } = useTheme();
  const [files, setFiles] = useState([]);
  const [parsedData, setParsedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'queued'
    }));
    setFiles(prev => [...prev, ...newFiles]);
    handleUpload(newFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    }
  });

  const handleUpload = (filesToUpload) => {
    setIsLoading(true);
    setParsedData(null);

    filesToUpload.forEach(file => {
      file.status = 'uploading';
      const interval = setInterval(() => {
        setFiles(currentFiles => currentFiles.map(f => {
          if (f.path === file.path && f.progress < 90) {
            return { ...f, progress: f.progress + 10 };
          }
          return f;
        }));
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        file.status = 'parsing';
        setFiles(currentFiles => currentFiles.map(f =>
          f.path === file.path ? { ...f, status: 'parsing', progress: 95 } : f
        ));

        setTimeout(() => {
          const mockData = generateMockInvoiceData(file.name);
          setParsedData(mockData);
          setFiles(currentFiles => currentFiles.map(f =>
            f.path === file.path ? { ...f, status: 'complete', progress: 100 } : f
          ));
          setIsLoading(false);
        }, 1500);
      }, 2000);
    });
  };

  const handleConfirmAndSave = async () => {
    if (!parsedData) return;

    console.log('Attempting to save invoice...');
    console.log('User:', user);
    console.log('User ID:', user?.uid);
    console.log('Parsed data:', parsedData);

    const result = await addInvoice(parsedData);
    console.log('Save result:', result);
    
    if (result.success) {
      showToast("Invoice saved successfully!");
      setParsedData(null);
      setFiles([]);
    } else {
      showToast(`Error: ${result.error || 'Could not save invoice'}`, 'error');
    }
  };

  const removeFile = (filePath) => {
    setFiles(files => files.filter(f => f.path !== filePath));
  };

  return (
    <div className="h-full p-8 flex flex-col gap-8 overflow-y-auto">
      <header>
        <h1 
          className="text-3xl font-bold text-gray-800 dark:text-white"
          style={{ color: isDarkMode ? 'white' : undefined }}
        >
          Upload Invoices
        </h1>
        <p 
          className="mt-1 text-gray-600 dark:text-white"
          style={{ color: isDarkMode ? 'white' : undefined }}
        >
          Drag & drop files or click to upload.
        </p>
      </header>

      <div {...getRootProps()} className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-300 dark:border-gray-600 hover:border-blue-500/50 hover:bg-blue-500/5'}`}>
        <input {...getInputProps()} />
        <div className="text-center">
          <div className="mx-auto w-16 h-16 text-gray-400 dark:text-gray-500">{Icons.upload}</div>
          <p 
            className="mt-4 font-semibold text-gray-700 dark:text-white"
            style={{ color: isDarkMode ? 'white' : undefined }}
          >
            {isDragActive ? 'Drop the files here...' : 'Drag & drop invoices here, or click to select'}
          </p>
          <p 
            className="text-sm text-gray-500 dark:text-white"
            style={{ color: isDarkMode ? 'white' : undefined }}
          >
            PDF, DOCX, PNG, JPG supported
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Uploads
          </h2>
          {files.map(file => (
            <GlassCard key={file.path} className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 flex-shrink-0 text-gray-500 dark:text-white">{Icons.file}</div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm truncate text-gray-800 dark:text-white">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-white">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300" style={{ width: `${file.progress}%` }}></div>
                  </div>
                  <p className="text-xs text-right mt-1 capitalize text-gray-600 dark:text-white">{file.status}...</p>
                </div>
              </div>
              <button onClick={() => removeFile(file.path)} className="hover:text-red-500 transition-colors">
                {Icons.close}
              </button>
            </GlassCard>
          ))}
        </div>
      )}

      {isLoading && !parsedData && (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-white">AI is processing your document...</p>
        </div>
      )}

      {parsedData && (
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Extracted Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm text-gray-700 dark:text-white">
            <div><strong>Vendor:</strong> <span>{parsedData.vendorName}</span></div>
            <div><strong>Invoice #:</strong> <span>{parsedData.invoiceNumber}</span></div>
            <div><strong>Date:</strong> <span>{parsedData.date}</span></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-800 dark:text-white">
              <thead className="border-b border-white/20">
                <tr>
                  <th className="p-2 text-gray-800 dark:text-white">Description</th>
                  <th className="p-2 text-center text-gray-800 dark:text-white">Quantity</th>
                  <th className="p-2 text-right text-gray-800 dark:text-white">Price</th>
                  <th className="p-2 text-right text-gray-800 dark:text-white">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.lineItems.map((item, i) => (
                  <tr key={i} className="border-b border-white/10">
                    <td className="p-2">{item.description}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">${item.price.toFixed(2)}</td>
                    <td className="p-2 text-right">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-xs text-sm space-y-2">
              <div className="flex justify-between"><span>Subtotal:</span><span>${parsedData.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax (15%):</span><span>${parsedData.tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-white/20 pt-2"><span>Total:</span><span>${parsedData.total.toFixed(2)}</span></div>
            </div>
          </div>
          <div className="flex justify-end mt-6 gap-3">
            <button onClick={() => setParsedData(null)} className="px-4 py-2 rounded-lg bg-gray-500/20 text-gray-800 dark:text-white hover:bg-gray-500/30">Discard</button>
            <button onClick={handleConfirmAndSave} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-90">Confirm & Save</button>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default Upload;