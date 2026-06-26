import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import {
  Check,
  ChevronDown,
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

const cardShapes = [
  "row-span-1",
  "row-span-1 sm:col-span-2",
  "row-span-2",
  "row-span-1",
  "row-span-2 sm:col-span-2",
  "row-span-1",
];

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [query, setQuery] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

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

  const selectedNote = useMemo(
    () => notes.find((note) => note._id === selectedNoteId),
    [notes, selectedNoteId],
  );

  const closeNote = () => {
    setSelectedNoteId(null);
    setEditId(null);
  };

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
      setIsComposerOpen(false);
      setSelectedNoteId(newNote.data?._id || null);

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
      closeNote();
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
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-800 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-200">
              <Sparkles size={15} />
              Personal workspace
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Notes
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-zinc-300">
              Click any note to focus it in a glass view with the rest of your
              board softly blurred behind it.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-64">
            <div className="glass-panel rounded-lg p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                Total
              </p>
              <p className="mt-1 text-2xl font-bold">{notes.length}</p>
            </div>
            <div className="glass-panel rounded-lg p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                Showing
              </p>
              <p className="mt-1 text-2xl font-bold">{filteredNotes.length}</p>
            </div>
          </div>
        </div>

        <section className="glass-panel overflow-hidden rounded-lg">
          <button
            type="button"
            onClick={() => setIsComposerOpen((isOpen) => !isOpen)}
            aria-expanded={isComposerOpen}
            className="focus-ring flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-white/70 dark:hover:bg-white/[0.04] sm:px-5"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-cyan-600 text-white shadow-sm shadow-cyan-600/20 dark:bg-cyan-500 dark:text-black">
                <Plus size={20} />
              </span>
              <span className="min-w-0">
                <span className="block font-bold">Add new note</span>
                <span className="block truncate text-sm text-slate-500 dark:text-zinc-500">
                  Open the composer when you are ready to write.
                </span>
              </span>
            </span>
            <ChevronDown
              size={20}
              className={`flex-none text-slate-500 transition duration-300 ${
                isComposerOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`grid transition-all duration-300 ease-out ${
              isComposerOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <form
              onSubmit={handleSubmit}
              className="min-h-0 overflow-hidden border-t border-slate-200/70 dark:border-white/10"
            >
              <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(180px,320px)_1fr_auto] lg:items-end">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-zinc-200">
                    Title
                  </span>
                  <input
                    type="text"
                    placeholder="Project idea"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-zinc-600"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-zinc-200">
                    Content
                  </span>
                  <textarea
                    placeholder="Write your note..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-zinc-600"
                  />
                </label>

                <Button
                  type="submit"
                  loading={loading}
                  icon={Plus}
                  className="w-full lg:w-auto"
                >
                  Add Note
                </Button>
              </div>
            </form>
          </div>
        </section>

        <section className="min-w-0">
          <div className="glass-panel mb-5 rounded-lg p-3">
            <div className="relative">
              <Search
                size={18}
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full rounded-lg border border-transparent bg-white/80 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:bg-black dark:text-white dark:placeholder:text-zinc-600 dark:focus:bg-black"
              />
            </div>
          </div>

          {fetching ? (
            <div className="grid auto-rows-[11rem] grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="glass-panel animate-pulse rounded-lg p-5"
                >
                  <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-zinc-800" />
                  <div className="mt-5 space-y-3">
                    <div className="h-3 rounded bg-slate-200 dark:bg-zinc-800" />
                    <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-zinc-800" />
                    <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="glass-panel flex min-h-72 flex-col items-center justify-center rounded-lg p-8 text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-zinc-900 dark:text-zinc-400">
                <FileText size={26} />
              </span>
              <h2 className="text-lg font-bold">
                {query ? "No matching notes" : "No notes yet"}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-zinc-500">
                {query
                  ? "Try a different keyword or clear the search field."
                  : "Open Add new note and your first note will appear here."}
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
            <div className="grid auto-rows-[11rem] grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredNotes.map((note, index) => {
                const longNote = note.content.length > 220;
                const shape = cardShapes[index % cardShapes.length];

                return (
                  <button
                    key={note._id}
                    type="button"
                    onClick={() => setSelectedNoteId(note._id)}
                    className={`glass-panel group flex min-h-44 cursor-pointer flex-col overflow-hidden rounded-lg p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-cyan-300/70 hover:shadow-xl dark:hover:border-cyan-500/50 ${shape}`}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <h3 className="line-clamp-2 text-lg font-bold text-slate-950 dark:text-white">
                        {note.title}
                      </h3>
                      <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-cyan-500 opacity-70 shadow-sm shadow-cyan-500/60 transition group-hover:scale-125 group-hover:opacity-100" />
                    </div>

                    <div className="relative min-h-0 flex-1 overflow-hidden">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-zinc-300">
                        {note.content}
                      </p>
                      {longNote && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/95 to-transparent dark:from-black/95" />
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold">
                      <span className="text-slate-400 dark:text-zinc-600">
                        Click to focus
                      </span>
                      <span className="inline-flex items-center gap-1 text-cyan-700 opacity-0 transition group-hover:opacity-100 dark:text-cyan-300">
                        Open
                        <ChevronDown size={14} className="-rotate-90" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </section>

      {selectedNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 backdrop-blur-md sm:p-6"
          onClick={closeNote}
        >
          <article
            className="note-zoom glass-panel flex max-h-[88vh] w-full max-w-4xl flex-col rounded-lg border-white/40 bg-white/92 p-5 shadow-2xl dark:border-white/10 dark:bg-black/86 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            {editId === selectedNote._id ? (
              <div className="flex min-h-0 flex-1 flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                    Editing note
                  </h2>
                  <button
                    type="button"
                    aria-label="Close note"
                    onClick={closeNote}
                    className="focus-ring rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:text-slate-950 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-2xl font-bold text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-black dark:text-white"
                />

                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-72 flex-1 resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-base leading-7 text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-black dark:text-zinc-200"
                />

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => setEditId(null)}
                    icon={X}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => handleUpdate(selectedNote._id)}
                    icon={Check}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                      Focused note
                    </p>
                    <h2 className="break-words text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                      {selectedNote.title}
                    </h2>
                  </div>

                  <div className="flex flex-none items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Edit ${selectedNote.title}`}
                      onClick={() => handleEdit(selectedNote)}
                      className="focus-ring rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:text-cyan-300"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${selectedNote.title}`}
                      onClick={() => handleDelete(selectedNote._id)}
                      className="focus-ring rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-rose-700 shadow-sm transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label="Close note"
                      onClick={closeNote}
                      className="focus-ring rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:text-slate-950 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-5">
                  <p className="whitespace-pre-wrap break-words text-base leading-8 text-slate-700 dark:text-zinc-200">
                    {selectedNote.content}
                  </p>
                </div>
              </>
            )}
          </article>
        </div>
      )}
    </main>
  );
}

export default Notes;
