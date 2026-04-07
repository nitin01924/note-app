import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../index.css";
import { getNotes, createNotes, deleteNote, updateNote } from "../services/api";

function Notes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes();
        setNotes(data.data);
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

    if (loading) return;

    try {
      setLoading(true);

      const newNote = await createNotes({ title, content });
      setNotes((prev) => [...prev, newNote.data]);
      setTitle("");
      setContent("");

      toast.success("Note added successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
        prev.map((note) => (note._id === id ? updated : note)),
      );

      setEditId(null);
      toast.success("Note updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ======= JSX (React UI) ======= //
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">My Notes</h1>

      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          <button
            disabled={loading}
            className={`w-full py-2 rounded ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {loading ? "Adding..." : "Add Note"}
          </button>
        </form>
      </div>

      <div className="w-full max-w-md mt-6 space-y-4">
        {notes.length === 0 ? (
          <p className="text-center text-gray-500">No notes found</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="bg-white p-4 rounded-xl shadow">
              {editId === note._id ? (
                <>
                  {/* EDIT MODE */}
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                  />

                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(note._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* NORMAL MODE */}
                  <h3 className="font-semibold text-lg">{note.title}</h3>
                  <p className="text-gray-600">{note.content}</p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(note)}
                      className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(note._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default Notes;
