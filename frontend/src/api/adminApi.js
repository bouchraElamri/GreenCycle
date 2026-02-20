const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

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
};

export default adminApi;
