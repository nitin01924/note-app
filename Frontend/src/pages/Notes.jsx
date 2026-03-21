import { useEffect, useState } from "react";
import { getNotes, createNotes, deleteNote } from "../services/api";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Fetch notes on load
  useEffect(() => {
    const fetchNotes = async () => {
      const data = await getNotes();
      setNotes(data.data);
    };

    fetchNotes();
  }, []);

  //  Create note
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    const newNote = await createNotes({ title, content });

    setNotes((prev) => [...prev, newNote.data]);

    setTitle("");
    setContent("");
  };

  //  Delete note
  const handleDelete = async (id) => {
    await deleteNote(id);

    setNotes((prev) => prev.filter((note) => note._id !== id));
  };

  return (
    <div>
      <h2>Your Notes</h2>

      {/*  Create Note Form */}
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
        ></textarea>
        <br />
        <br />

        <button type="submit">Add Note</button>
      </form>

      <hr />

      {/*  Notes List */}
      {notes.length === 0 ? (
        <p>No notes found</p>
      ) : (
        notes.map((note) => (
          <div key={note._id}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>

            <button onClick={() => handleDelete(note._id)}>Delete</button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Notes;
