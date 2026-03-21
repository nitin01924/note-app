import { useState } from "react";
import { createNotes } from "../services/api";

function CreateNote() {
  const [title, settitle] = useState("");
  const [content, setcontent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    const data = { title, content };
    const res = await createNotes(data);
    console.log(res);

    settitle("");
    setcontent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => settitle(e.target.value)}
      />
      <br />
      <br />

      <textarea
        placeholder="content"
        value={content}
        onChange={(e) => setcontent(e.target.value)}
      ></textarea>
      <br />
      <br />

      <button type="submit">Add Note</button>
    </form>
  );
}

export default CreateNote;
