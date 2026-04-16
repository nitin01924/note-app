const API_URL = import.meta.env.VITE_API_URL;

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  const data = await res.json();

  if (
    res.status === 401 &&
    token &&
    !endpoint.startsWith("/auth/login") &&
    !endpoint.startsWith("/auth/register")
  ) {
    localStorage.removeItem("token");
    window.location.href = "/";
    throw new Error(data.message || "Session expired. Please log in again.");
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
