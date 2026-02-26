const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = isJson
      ? (data.error || data.message || "Erreur API")
      : `Erreur API (${response.status}). Response non JSON received. Verify REACT_APP_API_URL.`;
    throw new Error(message);
  }

  return data;
}

const publicApi = { 
  // Login
  login: async ({ email, password }) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
    );
  },

  // Register
  register: async ({ firstName, lastName, email, phone, password, passwordConfirmation }) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, email, phone, password, passwordConfirmation
        }),
      })
    );
  },
  
  // Activate account
  activateAccount: async (token) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/activate/${token}`, { method: "GET" })
    );
  },

  // Forgot password
  forgotPassword: async (email) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/client/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
    );
  },

  // Reset password
  resetPassword: async (token, password,passwordConfirmation) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/client/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password,passwordConfirmation }),
      })
    );
  },

  // Verify JWT token
  verifyToken: async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/verify-token`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Get current logged-in user
  getCurrentUser: async (token) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  },

  // Logout (optionnel, peut être vide côté API)
  logout: async (token) => {
    // Si ton backend ne gère pas de logout, juste supprimer le token côté frontend
    return true;
  },

  getProducts: async (name = "") => {
    const query = name ? `?name=${encodeURIComponent(name)}` : "";
    const res = await fetch(`${API_BASE_URL}/getProducts${query}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error fetching products");
    }
    return res.json();
  },

  getNewestProducts: async (limit = 12) => {
    const res = await fetch(`${API_BASE_URL}/getProducts`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error fetching products");
    }

    const products = await res.json();
    const safeLimit = Number.isFinite(limit) ? Math.max(1, Number(limit)) : 12;

    return (Array.isArray(products) ? products : [])
      .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
      .slice(0, safeLimit);
  },

  getProductDetails: async (id) => {
    const res = await fetch(`${API_BASE_URL}/getProductById/${id}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Product not found");
    }
    return res.json();
  },
  // getProductsByCategory: async (categoryId) => {

  // };
  
  getCategories: async () => {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error fetching categories");
    }
    return res.json();
  },  
  getSeller: async (sellerId) => {
    const res = await fetch(`${API_BASE_URL}/sellers/${sellerId}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error fetching seller");
    }
    const payload = await res.json();
    return payload?.data ?? payload;
  },
  getProductByCategory: async (category) => {
    const categoryName = String(category || "").trim().toLowerCase();
    if (!categoryName) return [];

    // Primary path (if backend route exists)
    const res = await fetch(`${API_BASE_URL}/searchByCategory?categoryName=${encodeURIComponent(categoryName)}`);
    if (res.ok) {
      const payload = await res.json();
      return Array.isArray(payload) ? payload : payload?.data || [];
    }

    // Fallback path: fetch products and filter client-side by populated category name
    const allProductsRes = await fetch(`${API_BASE_URL}/getProducts`);
    if (!allProductsRes.ok) {
      const errorData = await allProductsRes.json();
      throw new Error(errorData.message || "Error fetching related products");
    }

    const products = await allProductsRes.json();
    return (Array.isArray(products) ? products : []).filter((product) => {
      const productCategoryName =
        typeof product?.category === "object" && product?.category !== null
          ? String(product.category.name || "").toLowerCase()
          : "";
      return productCategoryName === categoryName;
    });
  },

  sendContactMessage: async ({ name, email, phone, message }) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      })
    );
  },
  getProductBySeller: async (id) => {
    const res = await fetch(`${API_BASE_URL}/sellers/${id}/products`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error fetching products");
    }
    return res.json();
  }
};


export default publicApi;
