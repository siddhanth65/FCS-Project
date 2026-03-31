import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
  verifyEmail: (data) => api.post("/auth/verify-email", data),
  resendOTP: (data) => api.post("/auth/resend-otp", data),
};

export const userAPI = {
  getProfile: () => api.get("/profile/me"),
  updateProfile: (data) => api.put("/profile/me", data),
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/profile/upload-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  viewProfile: (userId) => api.get(`/profile/view/${userId}`),
  uploadResume: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/users/resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },
  listResumes: () => api.get("/users/resume/list"),
  downloadResume: (filename) =>
    api.get(`/users/resume/download/${filename}`, {
      responseType: "blob",
    }),
  deleteResume: (filename) => api.delete(`/users/resume/${filename}`),
};

export default api;
