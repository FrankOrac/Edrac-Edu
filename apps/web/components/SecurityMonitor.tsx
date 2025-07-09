
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Monitor, MapPin, Clock } from 'lucide-react';

interface SecurityAlert {
  id: string;
  type: 'suspicious_login' | 'multiple_devices' | 'location_change' | 'high_risk';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  userId: number;
  userEmail: string;
}

export default function SecurityMonitor() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [stats, setStats] = useState({
    activeSessions: 0,
    suspiciousAttempts: 0,
    blockedLogins: 0
  });

  useEffect(() => {
    // Mock security alerts
    const mockAlerts: SecurityAlert[] = [
      {
        id: '1',
        type: 'multiple_devices',
        message: 'User logged in from 3 different devices simultaneously',
        severity: 'high',
        timestamp: new Date().toISOString(),
        userId: 123,
        userEmail: 'student@example.com'
      },
      {
        id: '2',
        type: 'location_change',
        message: 'Login from unusual location detected',
        severity: 'medium',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userId: 456,
        userEmail: 'teacher@example.com'
      }
    ];

    setAlerts(mockAlerts);
    setStats({
      activeSessions: 892,
      suspiciousAttempts: 23,
      blockedLogins: 5
    });
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'multiple_devices': return <Monitor className="w-4 h-4" />;
      case 'location_change': return <MapPin className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center">
          <Shield className="w-6 h-6 mr-2 text-blue-600" />
          Security Monitor
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">System Secure</span>
          </div>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.activeSessions}</div>
          <div className="text-sm text-blue-600">Active Sessions</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.suspiciousAttempts}</div>
          <div className="text-sm text-yellow-600">Suspicious Attempts</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.blockedLogins}</div>
          <div className="text-sm text-red-600">Blocked Logins</div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">Recent Security Alerts</h4>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No security alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm opacity-75">{alert.userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center text-xs opacity-75">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
