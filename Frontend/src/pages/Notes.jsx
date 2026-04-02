import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getNotes, createNotes, deleteNote, updateNote } from "../services/api";

function Notes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes();
        setNotes(data.data); // adjust if needed
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchNotes();
  }, []);

  // Create note
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const newNote = await createNotes({ title, content });

      setNotes((prev) => [...prev, newNote.data]);
      setTitle("");
      setContent("");

      toast.success("Note added successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    try {
      await deleteNote(id);

      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Start editing
  const handleEdit = (note) => {
    setEditId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  // Update note
  const handleUpdate = async (id) => {
    try {
      const updated = await updateNote(id, {
        title: editTitle,
        content: editContent,
      });

      setNotes((prev) =>
        prev.map((note) => (note._id === id ? updated.data : note)),
      );

      setEditId(null);
      toast.success("Note updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= JSX (React UI) =================
  return (
    <div>
      <h2>My Notes</h2>

      {/* Create Note */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <br />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <br />
        <button type="submit">Add Note</button>
      </form>

      {/* Notes List */}
      {notes.length === 0 ? (
        <p>No notes found</p>
      ) : (
        notes.map((note) => (
          <div key={note._id}>
            {editId === note._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />

                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />

                <button onClick={() => handleUpdate(note._id)}>Save</button>
              </>
            ) : (
              <>
                <h3>{note.title}</h3>
                <p>{note.content}</p>

                <button onClick={() => handleEdit(note)}>Edit</button>

                <button onClick={() => handleDelete(note._id)}>Delete</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Notes;
