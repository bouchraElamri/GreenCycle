const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function getAuthToken() {
  return localStorage.getItem("authToken");
}

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = isJson
      ? data.error || data.message || "Seller API error"
      : `Seller API error (${response.status})`;
    throw new Error(message);
  }

  return data;
}

function authHeaders(base = {}) {
  const token = getAuthToken();
  return token ? { ...base, Authorization: `Bearer ${token}` } : base;
}

const sellerApi = {
  getCurrentUser: async () =>
    handleResponse(
      await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: authHeaders(),
      })
    ),

  getSellerProfile: async () =>
    handleResponse(
      await fetch(`${API_BASE_URL}/seller/profile`, {
        method: "GET",
        headers: authHeaders(),
      })
    ),

  updateSellerProfile: async ({ description, address, bankAccount }) =>
    handleResponse(
      await fetch(`${API_BASE_URL}/seller/profile`, {
        method: "PATCH",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ description, address, bankAccount }),
      })
    ),

  getCategories: async () =>
    handleResponse(
      await fetch(`${API_BASE_URL}/categories`, {
        method: "GET",
      })
    ),

  getProducts: async (name = "") => {
    const query = name ? `?name=${encodeURIComponent(name)}` : "";
    return handleResponse(
      await fetch(`${API_BASE_URL}/getProducts${query}`, {
        method: "GET",
      })
    );
  },

  addProduct: async ({ name, description, price, quantity, category, images = [] }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("quantity", String(quantity));
    formData.append("category", category);

    images.forEach((file) => {
      formData.append("images", file);
    });

    return handleResponse(
      await fetch(`${API_BASE_URL}/seller/addProduct`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      })
    );
  },

  updateProduct: async (productId, payload) => {
    const formData = new FormData();
    const allowedKeys = ["name", "description", "price", "quantity", "category"];

    allowedKeys.forEach((key) => {
      if (payload[key] !== undefined && payload[key] !== null && payload[key] !== "") {
        formData.append(key, String(payload[key]));
      }
    });

    (payload.images || []).forEach((file) => {
      formData.append("images", file);
    });

    return handleResponse(
      await fetch(`${API_BASE_URL}/seller/editProduct/${productId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: formData,
      })
    );
  },

  deleteProduct: async (productId) =>
    handleResponse(
      await fetch(`${API_BASE_URL}/seller/deleteProduct/${productId}`, {
        method: "DELETE",
        headers: authHeaders(),
      })
    ),

  getSellerOrders: async (sellerId) =>
    handleResponse(
      await fetch(`${API_BASE_URL}/seller/orders/${sellerId}`, {
        method: "GET",
        headers: authHeaders(),
      })
    ),

  requestEmailChange: async (newEmail) =>
    handleResponse(
      await fetch(`${API_BASE_URL}/client/email-change/request`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ newEmail }),
      })
    ),

  confirmEmailChange: async (confirmationCode) =>
    handleResponse(
      await fetch(`${API_BASE_URL}/client/email-change/confirm`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ confirmationCode }),
      })
    ),

  changePassword: async ({ oldPassword, newPassword, newPasswordConfirmation }) =>
    handleResponse(
      await fetch(`${API_BASE_URL}/client/change-password`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ oldPassword, newPassword, newPasswordConfirmation }),
      })
    ),

  switchToSeller: async ({ description, address, bankAccount }) =>
    handleResponse(
      await fetch(`${API_BASE_URL}/client/switch-to-seller`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ description, address, bankAccount }),
      })
    ),

  updateProfile: async ({ firstName, lastName, phone }) =>
    handleResponse(
      await fetch(`${API_BASE_URL}/client/profile`, {
        method: "PATCH",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ firstName, lastName, phone }),
      })
    ),

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return handleResponse(
      await fetch(`${API_BASE_URL}/client/profile/picture`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      })
    );
  },
};

export default sellerApi;
