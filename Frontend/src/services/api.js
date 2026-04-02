import { apiRequest } from "../utils/api";

//CONNECT REGISTERUSER
export const registerUser = async (data) => {
  const response = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response;
};

// LOGIN USER
export const loginUser = async (data) => {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response;
};

// CREATE NOTES (PUSH)
export const createNotes = async (data) => {
  const response = await apiRequest("/notes", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response;
};

// FETCH NOTES (GET)
export const getNotes = async () => {
  const response = await apiRequest("/notes", {
    method: "GET",
  });
  return response;
};

// DELETE NOTE
export const deleteNote = async (id) => {
  const response = await apiRequest(`/notes/${id}`, {
    method: "DELETE",
  });

  return response;
};

// UPDATE NOTE
export const updateNote = async (id, data) => {
  const response = await apiRequest(`/notes/${id}`, {
    method: "PUT",

    body: JSON.stringify(data),
  });

  return response;
};
