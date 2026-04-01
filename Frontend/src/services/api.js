import { apiRequest } from "../utils/api";

//CONNECT REGISTERUSER
export const registerUser = async (data) => {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return data;
};

// LOGIN USER
export const loginUser = async (data) => {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return data;
};

// CREATE NOTES (PUSH)
export const createNotes = async (data) => {
  const token = localStorage.getItem("token");
  const data = await apiRequest("/notes", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return data;
};

// FETCH NOTES (GET)
export const getNotes = async () => {
  const token = localStorage.getItem("token");
  const data = await apiRequest("/notes", {
    method: "GET",
  });
  return data;
};

// DELETE NOTE
export const deleteNote = async (id) => {
  const token = localStorage.getItem("token");
  const data = await apiRequest(`/notes/${id}`, {
    method: "DELETE",
  });

  return data;
};

// UPDATE NOTE
export const updateNote = async (id, notedata) => {
  const data = await apiRequest(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(notedata),
  });

  return data;
};
