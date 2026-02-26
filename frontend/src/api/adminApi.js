const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = isJson
      ? data.error || data.message || "Admin API error"
      : `Admin API error (${response.status})`;
    throw new Error(message);
  }

  return data;
};

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
};

const adminApi = {
  getDashboard: async (token) =>
    handleResponse(
      await fetch(`${API_BASE_URL}/admin/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ),

  getUsers: async (token, { page = 1, limit = 10, q = "" } = {}) =>
    handleResponse(
      await fetch(
        `${API_BASE_URL}/admin/users${buildQuery({ page, limit, q })}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    ),

  getProductsForReview: async (token) =>
    handleResponse(
      await fetch(`${API_BASE_URL}/admin/getProducts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ),

  getCategories: async () =>
    handleResponse(
      await fetch(`${API_BASE_URL}/categories`, {
        method: "GET",
      })
    ),

  getAdminCategories: async (token) =>
    handleResponse(
      await fetch(`${API_BASE_URL}/admin/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ),

  createCategory: async (token, { name, description, imgFile }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (imgFile) {
      formData.append("img", imgFile);
    }

    return handleResponse(
      await fetch(`${API_BASE_URL}/admin/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
    );
  },

  updateCategory: async (token, categoryId, { name, description, imgFile }) => {
    const formData = new FormData();
    if (name !== undefined) {
      formData.append("name", name);
    }
    if (description !== undefined) {
      formData.append("description", description);
    }
    if (imgFile) {
      formData.append("img", imgFile);
    }

    return handleResponse(
      await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
    );
  },

  deleteCategory: async (token, categoryId) =>
    handleResponse(
      await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ),

  setProductApproval: async (token, productId, isApproved) =>
    handleResponse(
      await fetch(`${API_BASE_URL}/admin/products/approve/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isApproved }),
      })
    ),

  deleteProduct: async (token, productId) =>
    handleResponse(
      await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ),

  getOrders: async (token, status = "all") => {
    const endpoint =
      status === "confirmed"
        ? "/admin/orders/confirmed"
        : status === "delivered"
        ? "/admin/orders/delivered"
        : "/admin/orders";

    return handleResponse(
      await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
  },

  getOrderDetails: async (token, orderId) =>
    handleResponse(
      await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ),
};

export default adminApi;
