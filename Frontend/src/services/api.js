import { apiRequest } from "../utils/api";

//CONNECT REGISTERUSER
export const registerUser = async (data) => {
  const result = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return result;
};

// LOGIN USER
export const loginUser = async (data) => {
  const result = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return result.data;
};

// CREATE NOTES (PUSH)
export const createNotes = async (data) => {
  const result = await apiRequest("/notes", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return result;
};

// FETCH NOTES (GET)
export const getNotes = async () => {
  const result = await apiRequest("/notes", {
    method: "GET",
  });
  return result;
};

// DELETE NOTE
export const deleteNote = async (id) => {
  const result = await apiRequest(`/notes/${id}`, {
    method: "DELETE",
  });

  return result;
};

// UPDATE NOTE
export const updateNote = async (id, notedata) => {
  const result = await apiRequest(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(notedata),
  });

  return result;
};

// ResendVerification
export const resendVerification = async (email) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/resend-verification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
  );

  return res.json();
};
