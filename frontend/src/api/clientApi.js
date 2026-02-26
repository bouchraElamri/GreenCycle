const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function getAuthToken() {
  return localStorage.getItem("authToken");
}

function authHeaders(base = {}) {
  const token = getAuthToken();
  return token ? { ...base, Authorization: `Bearer ${token}` } : base;
}

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = isJson
      ? data.error || data.message || "Client API error"
      : `Client API error (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export const requestEmailChange = async (newEmail) =>
  handleResponse(
    await fetch(`${API_BASE_URL}/client/email-change/request`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      credentials: "include",
      body: JSON.stringify({ newEmail }),
    })
  );

export const confirmEmailChange = async (confirmationCode) =>
  handleResponse(
    await fetch(`${API_BASE_URL}/client/email-change/confirm`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      credentials: "include",
      body: JSON.stringify({ confirmationCode }),
    })
  );


export const changeProfilePic = async (profilePic)=>
  {
    const formData = new FormData();
    formData.append("image", profilePic);

    return handleResponse(
      await fetch(`${API_BASE_URL}/client/profile/picture`,{
        method: "POST",
        headers: authHeaders(),
        body: formData

      })
    );
  };

export const updatePassword = async (oldPassword, newPassword, newPasswordConfirmation) =>
  handleResponse(
    await fetch(`${API_BASE_URL}/client/change-password`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      credentials: "include",
      body: JSON.stringify({ oldPassword, newPassword, newPasswordConfirmation }),
    })
  );

export const addToCart = async ({ product, quantity }) =>
  handleResponse(
    await fetch(`${API_BASE_URL}/client/add-to-cart`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ product, quantity }),
    })
  );

  export const confirmPendingOrders = async ({ deliveryAddress, bankAccount }) =>
  handleResponse(
    await fetch(`${API_BASE_URL}/client/orders/confirm`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ deliveryAddress, bankAccount }),
    })
  );

export const getPendingOrders = async () =>
  handleResponse(
    await fetch(`${API_BASE_URL}/client/orders/pending`, {
      method: "GET",
      headers: authHeaders(),
    })
  );

export const updatePendingOrderQuantity = async (orderId, quantity) =>
  handleResponse(
    await fetch(`${API_BASE_URL}/client/orders/pending/${orderId}`, {
      method: "PATCH",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ quantity }),
    })
  );
export const getConfirmedOrders = async () =>
  handleResponse(
    await fetch(`${API_BASE_URL}/client/orders/confirmed`, {
      method: "GET",
      headers: authHeaders(),
    })
  );

export const deletePendingOrder = async (orderId) =>
  handleResponse(
    await fetch(`${API_BASE_URL}/client/orders/pending/${orderId}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
  );

export const getClientOrders = async (clientId) =>
  handleResponse(
    await fetch(`${API_BASE_URL}/client/orders/${clientId}`, {
      method: "GET",
      headers: authHeaders(),
    })
  );

