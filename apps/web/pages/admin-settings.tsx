
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Save, TestTube, Globe, DollarSign, BarChart3, Mail, MessageSquare, Settings } from 'lucide-react';

interface SettingsData {
  seo: any;
  advertising: any;
  analytics: any;
  notifications: any;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'seo' | 'advertising' | 'analytics' | 'notifications'>('seo');
  const [settings, setSettings] = useState<SettingsData>({
    seo: {},
    advertising: {},
    analytics: {},
    notifications: {}
  });
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const [seoRes, adsRes, analyticsRes, notificationsRes] = await Promise.all([
        fetch('/api/seo/settings'),
        fetch('/api/advertising/settings'),
        fetch('/api/web-analytics/settings'),
        fetch('/api/notification-settings/settings')
      ]);

      const [seo, advertising, analytics, notifications] = await Promise.all([
        seoRes.json(),
        adsRes.json(),
        analyticsRes.json(),
        notificationsRes.json()
      ]);

      setSettings({ seo, advertising, analytics, notifications });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (type: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/${type}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings[type as keyof SettingsData])
      });

      if (response.ok) {
        setSaveStatus('Settings saved successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (error) {
      setSaveStatus('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (category: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof SettingsData],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'advertising', label: 'Advertising', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Mail }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Settings</h1>
            <p className="text-gray-600">Manage SEO, advertising, analytics, and notifications</p>
          </div>

          {saveStatus && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {saveStatus}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* SEO Settings */}
              {activeTab === 'seo' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">SEO Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                      <input
                        type="text"
                        value={settings.seo.metaTitle || ''}
                        onChange={(e) => updateSetting('seo', 'metaTitle', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Your site title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                      <input
                        type="text"
                        value={settings.seo.metaKeywords || ''}
                        onChange={(e) => updateSetting('seo', 'metaKeywords', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="education, AI, learning"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                    <textarea
                      value={settings.seo.metaDescription || ''}
                      onChange={(e) => updateSetting('seo', 'metaDescription', e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe your platform"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">OG Title</label>
                      <input
                        type="text"
                        value={settings.seo.ogTitle || ''}
                        onChange={(e) => updateSetting('seo', 'ogTitle', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">OG Image URL</label>
                      <input
                        type="url"
                        value={settings.seo.ogImage || ''}
                        onChange={(e) => updateSetting('seo', 'ogImage', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => saveSettings('seo')}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    <span>{loading ? 'Saving...' : 'Save SEO Settings'}</span>
                  </button>
                </motion.div>
              )}

              {/* Advertising Settings */}
              {activeTab === 'advertising' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Advertising Settings</h2>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Google AdSense</h3>
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={settings.advertising.adsenseEnabled || false}
                        onChange={(e) => updateSetting('advertising', 'adsenseEnabled', e.target.checked)}
                        className="mr-2"
                      />
                      <label>Enable Google AdSense</label>
                    </div>
                    
                    {settings.advertising.adsenseEnabled && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">AdSense Client ID</label>
                          <input
                            type="text"
                            value={settings.advertising.adsenseClientId || ''}
                            onChange={(e) => updateSetting('advertising', 'adsenseClientId', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="ca-pub-xxxxxxxxxxxxxxxxx"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Revenue Sharing</h3>
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={settings.advertising.revenueSharing?.enabled || false}
                        onChange={(e) => updateSetting('advertising', 'revenueSharing', {
                          ...settings.advertising.revenueSharing,
                          enabled: e.target.checked
                        })}
                        className="mr-2"
                      />
                      <label>Enable Revenue Sharing</label>
                    </div>
                    
                    {settings.advertising.revenueSharing?.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">School Percentage</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={settings.advertising.revenueSharing?.schoolPercentage || 70}
                            onChange={(e) => updateSetting('advertising', 'revenueSharing', {
                              ...settings.advertising.revenueSharing,
                              schoolPercentage: parseInt(e.target.value)
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Platform Percentage</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={settings.advertising.revenueSharing?.platformPercentage || 30}
                            onChange={(e) => updateSetting('advertising', 'revenueSharing', {
                              ...settings.advertising.revenueSharing,
                              platformPercentage: parseInt(e.target.value)
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => saveSettings('advertising')}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    <span>{loading ? 'Saving...' : 'Save Advertising Settings'}</span>
                  </button>
                </motion.div>
              )}

              {/* Analytics Settings */}
              {activeTab === 'analytics' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Settings</h2>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Google Analytics</h3>
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={settings.analytics.googleAnalyticsEnabled || false}
                        onChange={(e) => updateSetting('analytics', 'googleAnalyticsEnabled', e.target.checked)}
                        className="mr-2"
                      />
                      <label>Enable Google Analytics</label>
                    </div>
                    
                    {settings.analytics.googleAnalyticsEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                        <input
                          type="text"
                          value={settings.analytics.googleAnalyticsId || ''}
                          onChange={(e) => updateSetting('analytics', 'googleAnalyticsId', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="G-XXXXXXXXXX"
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Google Tag Manager</h3>
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={settings.analytics.gtmEnabled || false}
                        onChange={(e) => updateSetting('analytics', 'gtmEnabled', e.target.checked)}
                        className="mr-2"
                      />
                      <label>Enable Google Tag Manager</label>
                    </div>
                    
                    {settings.analytics.gtmEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GTM Container ID</label>
                        <input
                          type="text"
                          value={settings.analytics.gtmId || ''}
                          onChange={(e) => updateSetting('analytics', 'gtmId', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="GTM-XXXXXXX"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => saveSettings('web-analytics')}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    <span>{loading ? 'Saving...' : 'Save Analytics Settings'}</span>
                  </button>
                </motion.div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailEnabled || false}
                        onChange={(e) => updateSetting('notifications', 'emailEnabled', e.target.checked)}
                        className="mr-2"
                      />
                      <label>Enable Email Notifications</label>
                    </div>
                    
                    {settings.notifications.emailEnabled && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Provider</label>
                          <select
                            value={settings.notifications.emailProvider || 'sendgrid'}
                            onChange={(e) => updateSetting('notifications', 'emailProvider', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                          >
                            <option value="sendgrid">SendGrid</option>
                            <option value="mailgun">Mailgun</option>
                            <option value="smtp">SMTP</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">SMS Notifications (Optional)</h3>
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsEnabled || false}
                        onChange={(e) => updateSetting('notifications', 'smsEnabled', e.target.checked)}
                        className="mr-2"
                      />
                      <label>Enable SMS Notifications</label>
                    </div>
                    
                    {settings.notifications.smsEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SMS Provider</label>
                        <select
                          value={settings.notifications.smsProvider || 'twilio'}
                          onChange={(e) => updateSetting('notifications', 'smsProvider', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        >
                          <option value="twilio">Twilio</option>
                          <option value="nexmo">Nexmo</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Notification Triggers</h3>
                    {[
                      { key: 'userRegistration', label: 'User Registration' },
                      { key: 'paymentSuccess', label: 'Payment Success' },
                      { key: 'examCompleted', label: 'Exam Completed' },
                      { key: 'assignmentDue', label: 'Assignment Due' },
                      { key: 'gradeReleased', label: 'Grade Released' }
                    ].map((trigger) => (
                      <div key={trigger.key} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <span className="font-medium">{trigger.label}</span>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.notifications.triggers?.[trigger.key]?.email || false}
                              onChange={(e) => updateSetting('notifications', 'triggers', {
                                ...settings.notifications.triggers,
                                [trigger.key]: {
                                  ...settings.notifications.triggers?.[trigger.key],
                                  email: e.target.checked
                                }
                              })}
                              className="mr-2"
                            />
                            Email
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.notifications.triggers?.[trigger.key]?.sms || false}
                              onChange={(e) => updateSetting('notifications', 'triggers', {
                                ...settings.notifications.triggers,
                                [trigger.key]: {
                                  ...settings.notifications.triggers?.[trigger.key],
                                  sms: e.target.checked
                                }
                              })}
                              className="mr-2"
                            />
                            SMS
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => saveSettings('notification-settings')}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    <span>{loading ? 'Saving...' : 'Save Notification Settings'}</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
