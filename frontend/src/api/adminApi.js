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
};

export default adminApi;
