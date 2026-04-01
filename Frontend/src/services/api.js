import { apiRequest } from "../utils/api";

//CONNECT REGISTERUSER
export const registerUser = async (data) => {
  const response = await apiRequest("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
};

// LOGIN USER
export const loginUser = async (data) => {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
};

// CREATE NOTES (PUSH)
export const createNotes = async (data) => {
  const token = localStorage.getItem("token");
  const response = await apiRequest("/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return response;
};

// FETCH NOTES (GET)
export const getNotes = async () => {
  const token = localStorage.getItem("token");

  const response = await apiRequest("/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

// DELETE NOTE
export const deleteNote = async (id) => {
  const token = localStorage.getItem("token");

  const response = await apiRequest(`/notes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

// UPDATE NOTE
export const updateNote = async (id, data) => {
  const token = localStorage.getItem("token");

  const response = await apiRequest(`/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return response;
};
