// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API service class for backend communication
class ApiService {
  private baseURL: string;
  private token: string | null = null;
  private guestId: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    // Get token from localStorage if available
    this.token = localStorage.getItem('auth_token');
    // Get or create guest ID for anonymous users
    this.guestId = localStorage.getItem('guest_id') || this.generateGuestId();
  }

  // Generate a unique guest ID
  private generateGuestId(): string {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guest_id', guestId);
    return guestId;
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Remove authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Make authenticated API request
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add existing headers
    if (options.headers) {
      const existingHeaders = new Headers(options.headers);
      existingHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    } else if (this.guestId) {
      headers['X-Guest-Id'] = this.guestId;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Authentication endpoints
  async register(userData: { username: string; email: string; password: string }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Chat endpoints
  async createChat(chatData: { title: string; description?: string }) {
    return this.request('/chats', {
      method: 'POST',
      body: JSON.stringify(chatData),
    });
  }

  async getChats(limit?: number) {
    const params = limit ? `?limit=${limit}` : '';
    return this.request(`/chats${params}`);
  }

  async getChat(chatId: string, messageLimit?: number) {
    const params = messageLimit ? `?messageLimit=${messageLimit}` : '';
    return this.request(`/chats/${chatId}${params}`);
  }

  async sendMessage(chatId: string, message: string, stream = false) {
    if (stream) {
      // For streaming responses
      return this.sendStreamingMessage(chatId, message);
    }

    return this.request(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content: message, stream: false }),
    });
  }

  // Streaming message handler
  async sendStreamingMessage(chatId: string, message: string, signal?: AbortSignal) {
    const url = `${this.baseURL}/chats/${chatId}/messages`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    } else if (this.guestId) {
      headers['X-Guest-Id'] = this.guestId;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ content: message, stream: true }),
      signal, // Add abort signal support
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response; // Return response for streaming processing
  }

  async updateChat(chatId: string, updates: { title?: string; isPinned?: boolean }) {
    return this.request(`/chats/${chatId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteChat(chatId: string) {
    return this.request(`/chats/${chatId}`, {
      method: 'DELETE',
    });
  }

  // System endpoints
  async getSystemHealth() {
    return this.request('/system/health');
  }

  async getModels() {
    return this.request('/system/models');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;