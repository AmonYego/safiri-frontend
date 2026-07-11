import React, { useState } from 'react';
import { X, Smartphone, ShieldCheck, Loader } from 'lucide-react';

const MpesaModal = ({ details, fare, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    await onConfirm();
    setLoading(false);
  };

  if (!details) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-blue-900 rounded-lg shadow-2xl max-w-sm w-full animate-fade-in border border-blue-800">
        <div className="p-4 border-b border-blue-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-orange-500">M-Pesa Checkout</h2>
          {!loading && <button onClick={onClose} className="p-2 rounded-full hover:bg-blue-800"><X size={24} /></button>}
        </div>

        <div className="p-6 text-center">
          <Smartphone size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-200">
            A payment request of <span className="font-bold text-white">KSh {fare}</span> will be sent to:
          </p>
          <p className="text-2xl font-bold my-3 text-white">{details.phone_number}</p>
          <p className="text-sm text-gray-400">
            Click "Confirm & Pay", then enter your M-Pesa PIN on the pop-up on your phone to complete the transaction.
          </p>
        </div>

        <div className="p-4 bg-blue-950 border-t border-blue-800">
          <div className="flex items-center justify-center text-xs text-gray-400 mb-3">
            <ShieldCheck size={14} className="mr-1 text-orange-500" />
            <span>Secure payment powered by Safiri & M-Pesa</span>
          </div>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center disabled:bg-gray-500"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              `Confirm & Pay KSh ${fare}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MpesaModal;
