import axios from "axios";

const API_BASE_URL = "https://dummyjson.com";

// instance to use for all requests
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// add token automatically if user is logged in
api.interceptors.request.use(
  (config) => {
// get token from local storage
    const token = localStorage.getItem("token");
    if (token) {
// add token to request header
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (credentials) =>
    api.post("/auth/login", {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 30,
    }),
  getCurrentUser: () => api.get("/auth/me"),
  refreshToken: (refreshToken) =>
    api.post("/auth/refresh", { refreshToken: refreshToken }),
};

export const productsAPI = {
  getAll: (params) => api.get("/products", { params: params }),
  getById: (id) => api.get("/products/" + id),
  search: (query) => api.get("/products/search", { params: { q: query } }),
  getCategories: () => api.get("/products/categories"),
  getByCategory: (category) => api.get("/products/category/" + category),
  add: (product) => api.post("/products/add", product),
  update: (id, product) => api.put("/products/" + id, product),
  delete: (id) => api.delete("/products/" + id),
};

export const cartsAPI = {
  getAll: (params) => api.get("/carts", { params: params }),
  getById: (id) => api.get("/carts/" + id),
  getByUser: (userId) => api.get("/carts/user/" + userId),
  add: (cart) => api.post("/carts/add", cart),
  update: (id, cart) => api.put("/carts/" + id, cart),
  delete: (id) => api.delete("/carts/" + id),
};

export const usersAPI = {
  getAll: (params) => api.get("/users", { params: params }),
  getById: (id) => api.get("/users/" + id),
  search: (query) => api.get("/users/search", { params: { q: query } }),
  add: (user) => api.post("/users/add", user),
  update: (id, user) => api.put("/users/" + id, user),
  delete: (id) => api.delete("/users/" + id),
};

export default api;
