const API_BASE_URL = 'http://77.91.77.4:6969';

// Types for API responses
interface LoginResponse {
  access?: string;
  refresh?: string;
  user?: {
    id: number;
    email: string;
    username?: string;
  };
  message?: string;
}

interface ProfileResponse {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface RegisterResponse {
  message?: string;
  user?: {
    id: number;
    email: string;
    username?: string;
  };
}

export interface Customer {
  id?: number;
  name: string;
  website?: string;
  country: string;
  industry_category: number;
  activity_level: string;
  acquired_via: string;
  lead_score: number;
  notes: string;
}

export interface CustomerResponse {
  id: number;
  name: string;
  website?: string;
  country: string;
  industry_category: number;
  activity_level: string;
  acquired_via: string;
  lead_score: number;
  notes: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  company: number;
  company_name: string;
}

// Remove Task interface/type definitions
// Remove CreateTaskRequest, UpdateTaskRequest
// Remove getTasks, getTask, createTask, updateTask, deleteTask functions

// Authentication token management
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const setAuthToken = (token: string, refresh: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refresh);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem("refreshToken")
  }
};

// Generic API call function
export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: any = new Error(
        errorData.message ||
        errorData.detail ||
        `HTTP error! status: ${response.status}`
      );
      error.status = response.status;
      error.statusText = response.statusText;
      error.response = { ...errorData };
      throw error;
    }

    // For delete requests
    if (options.method === 'DELETE') {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// authentication
export const authAPI = {
  // login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiCall<LoginResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    //  token store 
    if (response.access) {
      setAuthToken(response.access, response.refresh);
    }

    return response;
  },

  // Register
  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<RegisterResponse> => {
    return await apiCall<RegisterResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
    });
  },

  // user profile
  getProfile: async (): Promise<ProfileResponse> => {
    return await apiCall<ProfileResponse>('/auth/profile/');
  },

  // logout
  logout: (): void => {
    removeAuthToken();
  },
};

// customer API
export const getCustomers = async (): Promise<CustomerResponse[]> => {
  return await apiCall<CustomerResponse[]>('/crm/companies/');
};

export const getCustomer = async (id: number): Promise<CustomerResponse> => {
  return await apiCall<CustomerResponse>(`/crm/companies/${id}/`);
};

export const createCustomer = async (
  customer: Customer,
): Promise<CustomerResponse> => {
  return await apiCall<CustomerResponse>('/crm/companies/', {
    method: 'POST',
    body: JSON.stringify(customer),
  });
};

export const updateCustomer = async (
  id: number,
  customer: Customer,
): Promise<CustomerResponse> => {
  return await apiCall<CustomerResponse>(`/crm/companies/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(customer),
  });
};

export const deleteCustomer = async (id: number): Promise<void> => {
  try {
    await apiCall<void>(`/crm/companies/${id}/`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(`Error deleting customer ${id}:`, error);
    throw error;
  }
};
