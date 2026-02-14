const API_BASE_URL = process.env.REACT_APP_API_URL;

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = isJson
      ? (data.error || data.message || "Erreur API")
      : `Erreur API (${response.status}). Réponse non JSON reçue. Vérifie REACT_APP_API_URL.`;
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
  register: async ({ firstName, lastName, email, phone, password, passwordConfirmation}) => {
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
      await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
    );
  },

  // Reset password
  resetPassword: async (token, password,passwordConfirmation) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/reset-password/${token}`, {
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

  getProducts: async () => {
    const res = await fetch(`${API_BASE_URL}/home`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Erreur lors de la récupération des produits");
    }
    return res.json();
  },

  getProductDetails: async (id) => {
    const res = await fetch(`${API_BASE_URL}/product-details/${id}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Produit non trouvé");
    }
    return res.json();
  }

};

export default publicApi;