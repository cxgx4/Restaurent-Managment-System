import axios from 'axios';

// Use environment variable with fallback to your current local URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Your existing functions (keep these exactly as they are)
export const getMenu = () => apiClient.get('/menu');
export const placeOrder = (orderData) => apiClient.post('/order', orderData);
export const getStatsSummary = () => apiClient.get('/stats/summary');
export const getMostOrderedItems = () => apiClient.get('/stats/most-ordered-items');
export const getPeakHours = () => apiClient.get('/stats/peak-hours');
export const getLowStockAlerts = () => apiClient.get('/stats/low-stock-alert');

// NEW: Enhanced functions for the improved UI
export const getOrderStatus = async (orderId) => {
  const response = await apiClient.get(`/orders/${orderId}`);
  return response;
};

// NEW: Inventory management functions
export const getInventory = async () => {
  const response = await apiClient.get('/inventory');
  return response;
};

export const updateInventoryItem = async (itemId, updates) => {
  const response = await apiClient.patch(`/inventory/${itemId}`, updates);
  return response;
};

export const addInventoryItem = async (itemData) => {
  const response = await apiClient.post('/inventory', itemData);
  return response;
};

// NEW: Analytics functions with mathematical calculations
export const getSalesAnalytics = async (timeframe = 'week') => {
  const response = await apiClient.get(`/analytics/sales?timeframe=${timeframe}`);
  return response;
};

export const getRevenueData = async (period = '30d') => {
  const response = await apiClient.get(`/analytics/revenue?period=${period}`);
  return response;
};

// NEW: Payment simulation function
export const processPayment = async (paymentData) => {
  // Simulate payment processing - replace with real payment gateway later
  const response = await apiClient.post('/payment/process', paymentData);
  return response;
};

// NEW: Utility function for error handling
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.detail || 'An error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      message: 'Network error. Please check your connection.',
      status: 0
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1
    };
  }
};

// NEW: Add request interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const handledError = handleApiError(error);
    console.error('API Error:', handledError);
    throw handledError;
  }
);

// NEW: Add auth token if you implement authentication later
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};