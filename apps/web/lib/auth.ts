import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  subscription?: {
    status: string;
    expiresAt: string | Date;
  };
}

interface AuthResponse {
  token: string;
  user: User;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:5000';

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log('Attempting login with:', { email, API_BASE_URL });

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Login successful');
      return true;
    } else {
      throw new Error(data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

export const hasActiveSubscription = (): boolean => {
  const user = getUser();

  // Admin and superadmin have full access
  if (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN' || user?.role === 'TEACHER') {
    return true;
  }

  // For other roles, check if they have an active subscription
  // Since we're not implementing subscriptions yet, we'll return true by default
  return true;
  
  // Uncomment this when implementing actual subscription checks:
  // return user?.subscription?.status === 'active' && 
  //        new Date(user.subscription.expiresAt) > new Date();
};

export const requireSubscription = (callback: () => void) => {
  if (!hasActiveSubscription()) {
    window.location.href = '/payments';
    return;
  }
  callback();
};

export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;

  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      logout();
      return false;
    }

    return true;
  } catch (error) {
    logout();
    return false;
  }
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;

  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    return null;
  }
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken();
  const isGuest = localStorage.getItem('isGuest') === 'true';

  // If in guest mode, return mock data
  if (isGuest) {
    console.log('Guest mode: returning mock data for', endpoint);
    return getMockData(endpoint);
  }

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        throw new Error('Unauthorized');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'API call failed');
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.log('API not available, returning mock data for', endpoint);
      return getMockData(endpoint);
    }
    throw error;
  }
};

const getMockData = (endpoint: string): any => {
  // Return mock data based on endpoint
  if (endpoint.includes('/api/students')) {
    return [
      { id: 1, name: 'John Student', email: 'student1@demo.com', grade: '10', status: 'Active' },
      { id: 2, name: 'Jane Student', email: 'student2@demo.com', grade: '11', status: 'Active' }
    ];
  }
  if (endpoint.includes('/api/teachers')) {
    return [
      { id: 1, name: 'John Teacher', email: 'teacher1@demo.com', subject: 'Mathematics', status: 'Active' },
      { id: 2, name: 'Jane Teacher', email: 'teacher2@demo.com', subject: 'Science', status: 'Active' }
    ];
  }
  if (endpoint.includes('/api/analytics')) {
    return {
      totalStudents: 450,
      totalTeachers: 32,
      activeClasses: 18,
      completedTests: 125
    };
  }
  // Default mock response
  return { message: 'Demo data', data: [] };
};