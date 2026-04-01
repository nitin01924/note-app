const API_URL = "http://localhost:3000/api";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await res.json();

  // ERROR HANDLING
  //  Handle unauthorized
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/";
    return;
  }

  //  Handle other errors
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};