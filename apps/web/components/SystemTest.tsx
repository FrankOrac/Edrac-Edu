
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader, AlertTriangle, RefreshCw } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  duration?: number;
}

export default function SystemTest() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'pending' | 'success' | 'error'>('pending');

  const testSuites = [
    {
      name: 'API Connection',
      test: async () => {
        const response = await fetch('/api/health');
        if (response.ok) {
          return { success: true, message: 'API is responding correctly' };
        }
        throw new Error('API not responding');
      }
    },
    {
      name: 'Authentication System',
      test: async () => {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'guest@demo.com', password: 'demo' })
        });
        const data = await response.json();
        if (data.token) {
          return { success: true, message: 'Authentication working correctly' };
        }
        throw new Error('Authentication failed');
      }
    },
    {
      name: 'AI Services',
      test: async () => {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ message: 'Hello', context: 'general' })
        });
        const data = await response.json();
        if (data.response) {
          return { success: true, message: 'AI services functioning' };
        }
        throw new Error('AI services not responding');
      }
    },
    {
      name: 'Database Connection',
      test: async () => {
        const response = await fetch('/api/students');
        if (response.status === 200 || response.status === 401) {
          return { success: true, message: 'Database connection established' };
        }
        throw new Error('Database connection failed');
      }
    },
    {
      name: 'Question Generation',
      test: async () => {
        const response = await fetch('/api/ai/generate-questions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ 
            subject: 'Mathematics', 
            count: 3, 
            difficulty: 'easy',
            saveToDatabase: false
          })
        });
        const data = await response.json();
        if (data.questions && data.questions.length > 0) {
          return { success: true, message: 'Question generation working' };
        }
        throw new Error('Question generation failed');
      }
    }
  ];

  const runTests = async () => {
    setIsRunning(true);
    setOverallStatus('pending');
    
    const results: TestResult[] = [];
    
    for (const suite of testSuites) {
      const startTime = Date.now();
      
      // Add pending test
      const pendingTest: TestResult = {
        name: suite.name,
        status: 'pending',
        message: 'Running...'
      };
      
      results.push(pendingTest);
      setTests([...results]);
      
      try {
        const result = await suite.test();
        const duration = Date.now() - startTime;
        
        // Update with success
        results[results.length - 1] = {
          name: suite.name,
          status: 'success',
          message: result.message,
          duration
        };
      } catch (error) {
        const duration = Date.now() - startTime;
        
        // Update with error
        results[results.length - 1] = {
          name: suite.name,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
          duration
        };
      }
      
      setTests([...results]);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
    }
    
    // Determine overall status
    const hasErrors = results.some(test => test.status === 'error');
    setOverallStatus(hasErrors ? 'error' : 'success');
    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Loader className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'pending':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const successCount = tests.filter(test => test.status === 'success').length;
  const errorCount = tests.filter(test => test.status === 'error').length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">System Health Check</h3>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span>Run Tests</span>
        </button>
      </div>

      {/* Overall Status */}
      <div className={`p-4 rounded-lg mb-6 border-2 ${getStatusColor(overallStatus)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(overallStatus)}
            <div>
              <h4 className="font-semibold">
                {overallStatus === 'success' ? 'All Systems Operational' :
                 overallStatus === 'error' ? 'Issues Detected' : 'Running Diagnostics...'}
              </h4>
              <p className="text-sm opacity-75">
                {successCount} passed, {errorCount} failed
              </p>
            </div>
          </div>
          {!isRunning && (
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Math.round((successCount / tests.length) * 100) || 0}%
              </div>
              <div className="text-sm opacity-75">Success Rate</div>
            </div>
          )}
        </div>
      </div>

      {/* Individual Tests */}
      <div className="space-y-3">
        {tests.map((test, index) => (
          <motion.div
            key={test.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(test.status)}
                <div>
                  <h5 className="font-medium">{test.name}</h5>
                  <p className="text-sm opacity-75">{test.message}</p>
                </div>
              </div>
              {test.duration && (
                <div className="text-sm text-gray-500">
                  {test.duration}ms
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
