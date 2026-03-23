import { useEffect, useState } from "react";
import { getNotes, createNotes, deleteNote, updateNote } from "../services/api";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  //   Edit state
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  //   Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      const data = await getNotes();
      setNotes(data.data);
    };

    fetchNotes();
  }, []);

  //   Create note
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

  //   Delete note
  const handleDelete = async (id) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((note) => note._id !== id));
  };

  //   Start editing
  const handleEdit = (note) => {
    setEditId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  //   Update note
  const handleUpdate = async (id) => {
    const updated = await updateNote(id, {
      title: editTitle,
      content: editContent,
    });

    setNotes((prev) =>
      prev.map((note) => (note._id === id ? updated.data : note)),
    );

    setEditId(null);
  };

  return (
    <div>
      <h2>Your Notes</h2>

      {/*   Create Note */}
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

      {/*   Notes List */}
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
                <br />
                <br />

                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                ></textarea>
                <br />
                <br />

                <button onClick={() => handleUpdate(note._id)}>Save</button>
              </>
            ) : (
              <>
                <h4>{note.title}</h4>
                <p>{note.content}</p>

                <button onClick={() => handleEdit(note)}>Edit</button>

                <button onClick={() => handleDelete(note._id)}>Delete</button>
              </>
            )}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Notes;
