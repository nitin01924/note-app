//CONNECT REGISTERUSER
export const registerUser = async (data) => {
  const response = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
};

// LOGIN USER
export const loginUser = async (data) => {
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
};

// CREATE NOTES (PUSH)
export const createNotes = async (data) => {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:3000/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
};

// FETCH NOTES (GET)
export const getNotes = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:3000/api/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

// DELETE NOTE
export const deleteNote = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

// UPDATE NOTE
export const updateNote = async (id, data) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
};
