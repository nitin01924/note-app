import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import {
  Check,
  Edit3,
  FileText,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import "../index.css";
import { getNotes, createNotes, deleteNote, updateNote } from "../services/api";
import Button from "../components/Button";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [query, setQuery] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes();
        setNotes(data.data || []);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setFetching(false);
      }
    };

    fetchNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) return notes;

    return notes.filter((note) => {
      return `${note.title} ${note.content}`.toLowerCase().includes(searchText);
    });
  }, [notes, query]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const newNote = await createNotes({
        title: title.trim(),
        content: content.trim(),
      });

      setNotes((prev) => [newNote.data, ...prev]);
      setTitle("");
      setContent("");

      toast.success("Note added successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);

      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (note) => {
    setEditId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleUpdate = async (id) => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await updateNote(id, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });
      const updatedNote = response.data || response;

      setNotes((prev) =>
        prev.map((note) => (note._id === id ? updatedNote : note)),
      );

      setEditId(null);
      toast.success("Note updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <main className="app-shell px-4 pb-12 pt-8 text-slate-950 dark:text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-800 dark:border-cyan-900/70 dark:bg-cyan-950/60 dark:text-cyan-200">
              <Sparkles size={15} />
              Personal workspace
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Notes
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Capture ideas, polish drafts, and find anything quickly when you
              come back later.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-64">
            <div className="glass-panel rounded-lg p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Total
              </p>
              <p className="mt-1 text-2xl font-bold">{notes.length}</p>
            </div>
            <div className="glass-panel rounded-lg p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Showing
              </p>
              <p className="mt-1 text-2xl font-bold">{filteredNotes.length}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
          <aside className="glass-panel h-fit rounded-lg p-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-600 text-white">
                <Plus size={20} />
              </span>
              <div>
                <h2 className="font-bold">New note</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Keep it short or write the whole thought.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Title
                </span>
                <input
                  type="text"
                  placeholder="Project idea"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Content
                </span>
                <textarea
                  placeholder="Write your note..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={7}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <Button type="submit" loading={loading} icon={Plus} className="w-full">
                Add Note
              </Button>
            </form>
          </aside>

          <section className="min-w-0">
            <div className="glass-panel mb-4 rounded-lg p-3">
              <div className="relative">
                <Search
                  size={18}
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full rounded-lg border border-transparent bg-white/70 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:bg-slate-950/60 dark:text-white dark:focus:bg-slate-950"
                />
              </div>
            </div>

            {fetching ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="glass-panel h-44 animate-pulse rounded-lg p-5"
                  >
                    <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-5 space-y-3">
                      <div className="h-3 rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="glass-panel flex min-h-72 flex-col items-center justify-center rounded-lg p-8 text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  <FileText size={26} />
                </span>
                <h2 className="text-lg font-bold">
                  {query ? "No matching notes" : "No notes yet"}
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {query
                    ? "Try a different keyword or clear the search field."
                    : "Create your first note and it will appear here instantly."}
                </p>
                {query && (
                  <Button
                    variant="secondary"
                    className="mt-5"
                    onClick={() => setQuery("")}
                    icon={X}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredNotes.map((note) => (
                  <article
                    key={note._id}
                    className="glass-panel group flex min-h-48 flex-col rounded-lg p-5 transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {editId === note._id ? (
                      <div className="flex h-full flex-col gap-3">
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 font-semibold text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />

                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={6}
                          className="min-h-28 w-full flex-1 resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />

                        <div className="mt-auto flex gap-2">
                          <Button
                            variant="success"
                            onClick={() => handleUpdate(note._id)}
                            icon={Check}
                            className="flex-1"
                          >
                            Save
                          </Button>

                          <Button
                            variant="secondary"
                            onClick={() => setEditId(null)}
                            icon={X}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <h3 className="line-clamp-2 text-lg font-bold text-slate-950 dark:text-white">
                            {note.title}
                          </h3>
                          <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/60" />
                        </div>
                        <p className="line-clamp-6 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {note.content}
                        </p>

                        <div className="mt-auto flex gap-2 pt-5">
                          <Button
                            variant="secondary"
                            onClick={() => handleEdit(note)}
                            icon={Edit3}
                            className="flex-1"
                          >
                            Edit
                          </Button>

                          <Button
                            variant="danger"
                            onClick={() => handleDelete(note._id)}
                            icon={Trash2}
                          >
                            Delete
                          </Button>
                        </div>
                      </>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

export default Notes;
