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
};

export default publicApi;
