import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: add the JWT token to headers if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: refresh token on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_BASE_URL}auth/refresh/`, { refresh: refreshToken });
                localStorage.setItem('access_token', response.data.access);
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (data) => api.post('auth/login/', data),
    register: (data) => api.post('auth/register/', data),
    getProfile: () => api.get('auth/profile/'),
};

export const userService = {
    getUsers: () => api.get('users/'),
    getUser: (id) => api.get(`users/${id}/`),
    updateUser: (id, data) => api.put(`users/${id}/`, data),
    deleteUser: (id) => api.delete(`users/${id}/`),
};

export const productService = {
    getProducts: () => api.get('products/'),
    createProduct: (data) => api.post('products/', data),
    updateProduct: (id, data) => api.put(`products/${id}/`, data),
    deleteProduct: (id) => api.delete(`products/${id}/`),
};

export const inventoryService = {
    getInventory: () => api.get('inventory/'),
    updateStock: (id, data) => api.put(`inventory/${id}/update-stock/`, data),
    getStatus: () => api.get('inventory/status/'),
};

export const salesService = {
    getSales: () => api.get('sales/'),
    createSale: (data) => api.post('sales/', data),
    getDailySummary: (date) => api.get(`sales/daily/?date=${date}`),
    getProfitLoss: (days) => api.get(`sales/profit-loss/?days=${days}`),
};

export const reservationService = {
    getReservations: () => api.get('reservations/'),
    createReservation: (data) => api.post('reservations/', data),
    updateAction: (id, action) => api.put(`reservations/${id}/${action}/`),
};

export const paymentService = {
    getPayments: () => api.get('payments/'),
    recordPayment: (data) => api.post('payments/', data),
    getDebts: (all = false) => api.get(`debts/?all=${all}`),
    getDebt: (id) => api.get(`debts/${id}/`),
};

export const feedbackService = {
    getFeedback: () => api.get('feedback/'),
    submitFeedback: (data) => api.post('feedback/', data),
};

export const shopService = {
    getStatus: () => api.get('shop/status/'),
    toggleStatus: (isOpen) => api.put('shop/status/', { is_open: isOpen }),
};

export const analyticsService = {
    getSalesData: (days) => api.get(`analytics/sales/?days=${days}`),
    getProfitData: (days) => api.get(`analytics/profit/?days=${days}`),
    getComparisonData: (days) => api.get(`analytics/comparison/?days=${days}`),
};

export default api;
