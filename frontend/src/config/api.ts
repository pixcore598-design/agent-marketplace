// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data: T } | { error: string }> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  return response.json();
}

// Auth API
export const authApi = {
  register: (email: string, password: string, name?: string) =>
    apiFetch<{ token: string; user: { id: string; email: string; name?: string } }>(
      '/api/auth/register',
      { method: 'POST', body: JSON.stringify({ email, password, name }) }
    ),
  
  login: (email: string, password: string) =>
    apiFetch<{ token: string; user: { id: string; email: string; name?: string } }>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),
  
  me: () => apiFetch<{ id: string; email: string; name?: string }>('/api/auth/me'),
};

// Agents API
export const agentsApi = {
  list: (page = 1, limit = 10) =>
    apiFetch<{ agents: any[]; pagination: { total: number; page: number; limit: number } }>(
      `/api/agents?page=${page}&limit=${limit}`
    ),
  
  get: (id: string) => apiFetch<any>(`/api/agents/${id}`),
  
  create: (data: { name: string; description?: string; capabilities?: string[] }) =>
    apiFetch<any>('/api/agents', { method: 'POST', body: JSON.stringify(data) }),
};

// Tasks API
export const tasksApi = {
  list: (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    return apiFetch<{ tasks: any[]; pagination: { total: number } }>(`/api/tasks?${params}`);
  },
  
  get: (id: string) => apiFetch<any>(`/api/tasks/${id}`),
  
  create: (data: { title: string; description?: string; budget?: number }) =>
    apiFetch<any>('/api/tasks', { method: 'POST', body: JSON.stringify(data) }),
  
  claim: (id: string) =>
    apiFetch<any>(`/api/tasks/${id}/claim`, { method: 'PUT' }),
};