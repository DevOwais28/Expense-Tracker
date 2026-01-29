import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.PROD ? "expense-tracker-production-d7b0.up.railway.app/api/" : "http://localhost:4000/api/",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401 && typeof window !== "undefined") {
            // Session cookie will be cleared by server logout
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const apiRequest = async (
    method = "POST",
    url = "users/signup",
    data = {},
    params = {},
    isFormData = false
) => {
    console.log(`API Request: ${method} ${url}`, { data, params, isFormData });
    
    // Handle FormData
    const config = {
      timeout: 30000, // 30 second timeout
    };
    
    if (isFormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data',
      };
      // Don't pass params when using FormData to avoid URL encoding issues
      params = {};
    }
    
    try {
      const res = await api({ method, url, data, params, ...config });
      console.log(`API Response: ${method} ${url}`, res);
      return res;
    } catch (error) {
      console.error(`API Error: ${method} ${url}`, error);
      throw error;
    }
};


