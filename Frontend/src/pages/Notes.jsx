import { useEffect, useState } from "react";
import { getNotes } from "../services/api";

function Notes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const data = await getNotes();
      console.log(data);
      setNotes(data.data);
    };
    fetchNotes();
  }, []);

  return (
    <div>
      <h2>Your Notes</h2>

      {notes.length === 0 ? (
        <p>No notes found</p>
      ) : (
        notes.map((note) => (
          <div key={note._id}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Notes;
