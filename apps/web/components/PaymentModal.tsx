
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, Building, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: number;
    name: string;
    price: number;
    features: string[];
  };
}

export default function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>('stripe');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const paymentProviders = [
    { id: 'stripe', name: 'Stripe', icon: CreditCard, description: 'Credit/Debit Cards' },
    { id: 'paystack', name: 'Paystack', icon: CreditCard, description: 'Nigerian Payments' },
    { id: 'flutterwave', name: 'Flutterwave', icon: Smartphone, description: 'African Payments' },
    { id: 'offline', name: 'Offline Payment', icon: Building, description: 'Bank Transfer/Cash' }
  ];

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          provider: selectedProvider,
          amount: plan.price,
          email: JSON.parse(localStorage.getItem('user') || '{}').email,
          planId: plan.id,
          billingCycle: 'monthly'
        })
      });

      const data = await response.json();

      if (data.success) {
        // Handle different payment providers
        switch (selectedProvider) {
          case 'stripe':
            // Redirect to Stripe checkout or handle client-side
            window.alert('Stripe payment initialization successful');
            break;
          case 'paystack':
            window.open(data.data.authorization_url, '_blank');
            break;
          case 'flutterwave':
            window.open(data.data.link, '_blank');
            break;
          case 'offline':
            window.alert(`Payment reference: ${data.data.reference}\n${data.data.instructions}`);
            break;
        }
        onClose();
      } else {
        setError('Payment initialization failed');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Complete Payment</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Plan Summary */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">{plan.name} Plan</h4>
            <p className="text-3xl font-bold text-blue-600 mb-3">${plan.price}/month</p>
            <div className="space-y-1">
              {plan.features.slice(0, 3).map((feature, index) => (
                <p key={index} className="text-sm text-gray-600">✓ {feature}</p>
              ))}
            </div>
          </div>

          {/* Payment Providers */}
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-900">Choose Payment Method</h4>
            {paymentProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedProvider === provider.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <provider.icon className="text-gray-600" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">{provider.name}</p>
                    <p className="text-sm text-gray-600">{provider.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl mb-4">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Payment Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Pay $${plan.price}`}
          </motion.button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Secure payment processing. Your data is protected.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
