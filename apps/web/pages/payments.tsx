
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import PaymentModal from '../components/PaymentModal';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, DollarSign, TrendingUp, Calendar, Users, Crown, Check, X, AlertCircle, Smartphone } from 'lucide-react';

interface Subscription {
  id: number;
  plan: string;
  price: number;
  billing: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired';
  users: number;
  features: string[];
  nextBilling: string;
}

interface Payment {
  id: number;
  payer: string;
  amount: number;
  date: string;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'subscription' | 'one-time';
  reference?: string;
}

const plans = [
  {
    name: 'Starter',
    price: 29,
    users: 100,
    features: ['Basic Analytics', 'Email Support', 'Core Features', '5GB Storage'],
    popular: false,
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Professional',
    price: 99,
    users: 500,
    features: ['Advanced Analytics', 'Priority Support', 'All Features', '50GB Storage', 'API Access'],
    popular: true,
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Enterprise',
    price: 299,
    users: 2000,
    features: ['Custom Analytics', '24/7 Support', 'White Label', 'Unlimited Storage', 'Custom Integrations'],
    popular: false,
    color: 'from-orange-500 to-orange-600'
  }
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'payments' | 'billing'>('overview');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [stats, setStats] = useState({
    totalRevenue: 284750,
    monthlyRecurring: 89250,
    activeSubscriptions: 1247,
    churnRate: 2.3
  });

  useEffect(() => {
    // Mock data for subscriptions
    setSubscriptions([
      {
        id: 1,
        plan: 'Professional',
        price: 99,
        billing: 'monthly',
        status: 'active',
        users: 450,
        features: ['Advanced Analytics', 'Priority Support', 'All Features'],
        nextBilling: '2024-02-15'
      },
      {
        id: 2,
        plan: 'Enterprise',
        price: 299,
        billing: 'yearly',
        status: 'active',
        users: 1800,
        features: ['Custom Analytics', '24/7 Support', 'White Label'],
        nextBilling: '2024-12-01'
      }
    ]);

    // Mock payment data
    setPayments([
      {
        id: 1,
        payer: 'St. Mary\'s School',
        amount: 99,
        date: '2024-01-15T10:30:00Z',
        method: 'Credit Card',
        status: 'completed',
        type: 'subscription',
        reference: 'TXN-001'
      },
      {
        id: 2,
        payer: 'Lincoln High School',
        amount: 299,
        date: '2024-01-14T14:20:00Z',
        method: 'Bank Transfer',
        status: 'completed',
        type: 'subscription',
        reference: 'TXN-002'
      }
    ]);
  }, []);

  const StatCard = ({ title, value, change, icon: Icon, color, prefix = '', suffix = '' }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color} text-white`}>
          <Icon size={24} />
        </div>
        {change && (
          <div className={`text-sm font-semibold ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </p>
    </motion.div>
  );

  const PlanCard = ({ plan, isYearly = false }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 ${
        plan.popular ? 'border-purple-500' : 'border-gray-200'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
            Most Popular
          </div>
        </div>
      )}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">
            ${isYearly ? Math.round(plan.price * 12 * 0.8) : plan.price}
          </span>
          <span className="text-gray-600">/{isYearly ? 'year' : 'month'}</span>
          {isYearly && (
            <div className="text-green-600 text-sm font-semibold mt-1">Save 20%</div>
          )}
        </div>
        <div className="space-y-3 mb-8">
          <div className="flex items-center text-gray-600">
            <Users size={16} className="mr-2" />
            Up to {plan.users.toLocaleString()} users
          </div>
          {plan.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center text-gray-600">
              <Check size={16} className="mr-2 text-green-600" />
              {feature}
            </div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedPlan(plan);
            setShowPaymentModal(true);
          }}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            plan.popular
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          {plan.popular ? 'Get Started' : 'Choose Plan'}
        </motion.button>
      </div>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={stats.totalRevenue}
                change={18.5}
                icon={DollarSign}
                color="from-green-500 to-green-600"
                prefix="$"
              />
              <StatCard
                title="Monthly Recurring"
                value={stats.monthlyRecurring}
                change={12.3}
                icon={TrendingUp}
                color="from-blue-500 to-blue-600"
                prefix="$"
              />
              <StatCard
                title="Active Subscriptions"
                value={stats.activeSubscriptions}
                change={8.7}
                icon={Users}
                color="from-purple-500 to-purple-600"
              />
              <StatCard
                title="Churn Rate"
                value={stats.churnRate}
                change={-0.5}
                icon={AlertCircle}
                color="from-red-500 to-red-600"
                suffix="%"
              />
            </div>

            {/* Revenue Chart Placeholder */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Revenue Trends</h3>
              <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                <p className="text-gray-600">Revenue chart visualization would go here</p>
              </div>
            </div>
          </div>
        );

      case 'subscriptions':
        return (
          <div className="space-y-8">
            {/* Pricing Plans */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
              <p className="text-gray-600">Scale your educational platform with our flexible pricing</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <PlanCard key={index} plan={plan} />
              ))}
            </div>

            {/* Active Subscriptions */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Active Subscriptions</h3>
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-xl">
                        <Crown className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{sub.plan} Plan</h4>
                        <p className="text-gray-600">{sub.users} users • Next billing: {new Date(sub.nextBilling).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${sub.price}/{sub.billing === 'monthly' ? 'mo' : 'yr'}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Payment History</h3>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                Export Data
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 font-semibold text-gray-900">Payer</th>
                    <th className="text-left py-4 font-semibold text-gray-900">Amount</th>
                    <th className="text-left py-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-4 font-semibold text-gray-900">Method</th>
                    <th className="text-left py-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 font-semibold text-gray-900">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 font-medium text-gray-900">{payment.payer}</td>
                      <td className="py-4 text-gray-900">${payment.amount}</td>
                      <td className="py-4 text-gray-600">{new Date(payment.date).toLocaleDateString()}</td>
                      <td className="py-4 text-gray-600">{payment.method}</td>
                      <td className="py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-600 capitalize">{payment.type}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Billing Settings</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <CreditCard className="text-blue-600" size={24} />
                    <div>
                      <h4 className="font-semibold text-gray-900">Payment Method</h4>
                      <p className="text-gray-600">**** **** **** 4242</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold">
                    Update
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Calendar className="text-gray-600" size={24} />
                    <div>
                      <h4 className="font-semibold text-gray-900">Billing Cycle</h4>
                      <p className="text-gray-600">Monthly billing on the 15th</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold">
                    Change
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Providers */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Supported Payment Methods</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Stripe', icon: CreditCard, description: 'Credit/Debit Cards' },
                  { name: 'Paystack', icon: CreditCard, description: 'Nigerian Payments' },
                  { name: 'Flutterwave', icon: Smartphone, description: 'African Payments' },
                  { name: 'Offline', icon: DollarSign, description: 'Bank Transfer' }
                ].map((provider, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl text-center">
                    <provider.icon className="mx-auto mb-2 text-blue-600" size={24} />
                    <h4 className="font-semibold text-gray-900 text-sm">{provider.name}</h4>
                    <p className="text-xs text-gray-600">{provider.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout title="SaaS Payments & Billing">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SaaS Payments & Billing</h1>
          <p className="text-xl text-gray-600">Manage subscriptions, payments, and billing settings</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center">
          <div className="bg-gray-100 p-2 rounded-2xl">
            {[
              { id: 'overview', name: 'Overview', icon: TrendingUp },
              { id: 'subscriptions', name: 'Subscriptions', icon: Crown },
              { id: 'payments', name: 'Payments', icon: CreditCard },
              { id: 'billing', name: 'Billing', icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon size={20} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
        />
      )}
    </Layout>
  );
}
