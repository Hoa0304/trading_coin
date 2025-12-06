/**
 * API client để gọi backend Express
 * Thay thế Supabase client
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Lưu token trong localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// Helper để gọi API
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ==================== AUTHENTICATION ====================

export interface User {
  id: number;
  email: string;
  full_name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const auth = {
  // Đăng ký
  register: async (email: string, password: string, fullName?: string): Promise<AuthResponse> => {
    const data = await apiCall<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    setToken(data.token);
    return data;
  },

  // Đăng nhập
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const data = await apiCall<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async (): Promise<{ user: User }> => {
    return apiCall<{ user: User }>('/api/auth/me');
  },

  // Đăng xuất
  logout: (): void => {
    removeToken();
  },
};

// ==================== PORTFOLIO ====================

export interface Portfolio {
  id: number;
  user_id: number;
  btc_balance: number;
  usd_balance: number;
  created_at: string;
  updated_at: string;
}

export const portfolio = {
  // Lấy portfolio
  get: async (): Promise<Portfolio> => {
    return apiCall<Portfolio>('/api/portfolio');
  },

  // Cập nhật portfolio
  update: async (btc_balance: number, usd_balance: number): Promise<Portfolio> => {
    return apiCall<Portfolio>('/api/portfolio', {
      method: 'PUT',
      body: JSON.stringify({ btc_balance, usd_balance }),
    });
  },
};

// ==================== TRANSACTIONS ====================

export interface Transaction {
  id: number;
  user_id: number;
  type: 'buy' | 'sell';
  btc_amount: number;
  usd_amount: number;
  btc_price: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export const transactions = {
  // Lấy transactions
  get: async (limit: number = 10): Promise<Transaction[]> => {
    return apiCall<Transaction[]>(`/api/transactions?limit=${limit}`);
  },

  // Tạo transaction
  create: async (
    type: 'buy' | 'sell',
    btc_amount: number,
    usd_amount: number,
    btc_price: number
  ): Promise<Transaction> => {
    return apiCall<Transaction>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify({ type, btc_amount, usd_amount, btc_price }),
    });
  },
};

