// API 基礎配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);

// 專案 API
export const projectsApi = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.patch(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  getBudgetSummary: (id: string) => api.get(`/projects/${id}/budget-summary`),
};

// 供應商 API
export const vendorsApi = {
  getAll: () => api.get('/vendors'),
  getById: (id: string) => api.get(`/vendors/${id}`),
  create: (data: any) => api.post('/vendors', data),
  update: (id: string, data: any) => api.patch(`/vendors/${id}`, data),
  delete: (id: string) => api.delete(`/vendors/${id}`),
  updateRating: (id: string, rating: number) => 
    api.patch(`/vendors/${id}/rating`, { rating }),
  getPerformanceAnalysis: (vendorId?: string) => 
    api.get(`/vendors/performance-analysis${vendorId ? `?vendorId=${vendorId}` : ''}`),
  getBySpecialty: (specialty: string) => 
    api.get(`/vendors/by-specialty?specialty=${specialty}`),
  getTopVendors: (limit?: number) => 
    api.get(`/vendors/top-vendors${limit ? `?limit=${limit}` : ''}`),
};

// 材料 API
export const materialsApi = {
  getAll: () => api.get('/materials'),
  getById: (id: string) => api.get(`/materials/${id}`),
  create: (data: any) => api.post('/materials', data),
  update: (id: string, data: any) => api.patch(`/materials/${id}`, data),
  deactivate: (id: string) => api.delete(`/materials/${id}`),
  getCategories: () => api.get('/materials/categories'),
  search: (query: string) => api.get(`/materials/search?q=${query}`),
  getTopMaterials: (limit?: number) => 
    api.get(`/materials/top-materials${limit ? `?limit=${limit}` : ''}`),
  getUsageAnalysis: (materialId?: string) => 
    api.get(`/materials/usage-analysis${materialId ? `?materialId=${materialId}` : ''}`),
  getByCategory: (category: string) => api.get(`/materials/category/${category}`),
  getPriceHistory: (id: string) => api.get(`/materials/${id}/price-history`),
};

// 詢價 API
export const inquiriesApi = {
  getAll: () => api.get('/inquiries'),
  getById: (id: string) => api.get(`/inquiries/${id}`),
  create: (data: any) => api.post('/inquiries', data),
  getComparison: (id: string) => api.get(`/inquiries/${id}/comparison`),
  addResponse: (id: string, data: any) => api.post(`/inquiries/${id}/responses`, data),
  updateResponseStatus: (responseId: string, status: string) => 
    api.patch(`/inquiries/responses/${responseId}/status`, { status }),
};

// 採購單 API
export const purchaseOrdersApi = {
  getAll: () => api.get('/purchase-orders'),
  getById: (id: string) => api.get(`/purchase-orders/${id}`),
  create: (data: any) => api.post('/purchase-orders', data),
  update: (id: string, data: any) => api.patch(`/purchase-orders/${id}`, data),
  approve: (id: string, approvedBy: string) => 
    api.patch(`/purchase-orders/${id}/approve`, { approvedBy }),
  updateStatus: (id: string, status: string) => 
    api.patch(`/purchase-orders/${id}/status`, { status }),
  getDeliveryStatus: () => api.get('/purchase-orders/delivery-status'),
  getCostAnalysis: (projectId?: string) => 
    api.get(`/purchase-orders/cost-analysis${projectId ? `?projectId=${projectId}` : ''}`),
};