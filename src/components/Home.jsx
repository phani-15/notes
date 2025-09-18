import React, { useState, useEffect } from "react";
import { CircleUserRound } from "lucide-react";
import axios from "axios";

export default function Name() {
  const [det, setDet] = useState([])
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // ✅ Load user from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setDet({
        name: user.name,
        username: user.email,
        count: 0,
        userId: user._id,   // ✅ comes from MongoDB
      });

      // Fetch notes for this user
      axios
        .get(`http://localhost:3000/api/notes/${user._id}`)
        .then((res) => {
          setNotes(res.data);
          setDet((prev) => ({ ...prev, count: res.data.length }));
        })
        .catch((err) => console.error("Error fetching notes:", err));
    }
  }, []);

  // states for editing
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTextId, setEditingTextId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

  const [isHovered, setIsHovered] = useState(false);
  const [EditDetails, setEditDetails] = useState(false);

  const [tempName, setTempName] = useState("");
const [tempEmail, setTempEmail] = useState("");

useEffect(() => {
  if (det?.name && det?.username) {
    setTempName(det.name);
    setTempEmail(det.username);
  }
}, [det]);


  // ✅ Add note to backend
  const addNote = async () => {
    try {
      const newNote = {
        title: `New Note ${notes.length + 1}`,
        text: "Click to edit...",
        userId: det.userId,
      };
      const res = await axios.post(`http://localhost:3000/api/notes/${det.userId}`, newNote);

      setNotes([...notes, res.data]);
      setDet({ ...det, count: det.count + 1 });
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  // Save title locally (you can later add PUT request to backend)
  const saveTitle = async (id) => {
    try {
      const res = await axios.put(`http://localhost:3000/api/notes/${id}`, {
        title: editTitle,
        text: notes.find((n) => n._id === id).text, // keep old text
      });

      setNotes(notes.map((note) => (note._id === id ? res.data : note)));
      setEditingTitleId(null);
      setEditTitle("");
    } catch (err) {
      console.error("Error updating title:", err);
    }
  };


  // Save text locally (you can later add PUT request to backend)
  const saveText = async (id) => {
    try {
      const res = await axios.put(`http://localhost:3000/api/notes/${id}`, {
        title: notes.find((n) => n._id === id).title, // keep old title
        text: editText,
      });

      setNotes(notes.map((note) => (note._id === id ? res.data : note)));
      setEditingTextId(null);
      setEditText("");
    } catch (err) {
      console.error("Error updating text:", err);
    }
  };
  
const deleteNote = async (id) => {
  if (!window.confirm("Are you sure you want to delete this note?")) {
    return; // ✅ confirmation dialog
  }

  try {
    const res = await axios.delete(`http://localhost:3000/api/notes/${id}`);
    if (res.status === 200) {
      setNotes((prev) => prev.filter((note) => note._id !== id));
      setDet((prev) => ({ ...prev, count: prev.count - 1 }));
    }
  } catch (err) {
    console.error("Error deleting note:", err);
    alert("Failed to delete note. Please try again.");
  }
};

  const saveDetails = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/api/users/${det.userId}`, {
        name: tempName,
        email: tempEmail,
      });

      setDet({
        ...det,
        name: res.data.name,
        username: res.data.email,
      });

      localStorage.setItem("user", JSON.stringify(res.data)); // keep updated
      setEditDetails(false);
    } catch (err) {
      console.error("Error updating details:", err);
    }
  };


  return (
    <div className="text-center text-white mt-20">
      {/* Profile section */}
      <div
        className="flex justify-end items-center mr-10 mb-5 gap-3 relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CircleUserRound className="size-[3rem]" />
        {isHovered && !EditDetails && (
          <div className="absolute top-12 right-0 bg-gray-800 text-white text-left text-sm rounded-lg p-4 shadow-lg min-w-[200px]">
            <p>
              <span className="font-semibold">Name:</span> {det.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {det.username}
            </p>
            <p>
              <span className="font-semibold">Notes:</span> {det.count}
            </p>
            <button
              onClick={() => setEditDetails(true)}
              className="bg-slate-500 py-1 px-4 rounded-full"
            >
              edit
            </button>
          </div>
        )}
        {EditDetails && (
          <div className="absolute top-12 right-0 bg-gray-800 text-white text-left text-sm rounded-lg p-4 shadow-lg min-w-[200px]">
            <div className="flex flex-col gap-2">
              <div>
                <label className="font-semibold">Name:</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="ml-2 p-1 rounded text-black"
                />
              </div>
              <div>
                <label className="font-semibold">Email:</label>
                <input
                  type="text"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="ml-2 p-1 rounded text-black"
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  onClick={() => setEditDetails(false)}
                  className="bg-red-500 py-1 px-4 rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={saveDetails}
                  className="bg-green-500 py-1 px-4 rounded-full"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notes section */}
      <h1 className="text-5xl italic">Your Notes </h1>
      <div className="flex flex-wrap justify-center mt-10">
        {notes.map((note) => (
          <div
            key={note._id}
            className="border-2 min-w-[250px] bg-black max-w-100 border-gray-300 p-4 m-4 rounded-lg"
          >
            {/* Title */}
            {editingTitleId === note._id ? (
              <div>
                <input
                  type="text"
                  className="w-full mb-2 p-2 rounded border text-white "
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button
                    className="bg-green-500 px-3 py-1 rounded"
                    onClick={() => saveTitle(note._id)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-red-500 px-3 py-1 rounded"
                    onClick={() => setEditingTitleId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <h2
                  className="text-2xl font-semibold mb-2 cursor-pointer"
                  onClick={() => {
                    if (editingTitleId == null && editingTextId == null) {
                      setEditingTitleId(note._id);
                      setEditTitle(note.title);
                    }
                  }}
                >
                  {note.title}
                </h2>
                <div className="bg-slate-300 w-6 h-6 rounded-md" onClick={()=>deleteNote(note._id)}>
                  <img src="/images/image.png" alt="" />
                </div>
              </div>
            )}

            {/* Text */}
            {editingTextId === note._id ? (
              <div>
                <textarea
                  className=" p-2 rounded w-[350px] border text-white border-gray-400"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={4}
                  autoFocus
                />
                <div className="mt-2 flex gap-2 justify-center">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => saveText(note._id)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => setEditingTextId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p
                className="cursor-pointer"
                onClick={() => {
                  if (editingTextId == null && editingTitleId == null) {
                    setEditingTextId(note._id);
                    setEditText(note.text);
                  }
                }}
              >
                {note.text}
              </p>
            )}
          </div>
        ))}

        {/* Add Note */}
        <div
          className="border-2 bg-black max-w-100 min-w-50 border-gray-300 p-4 m-4 rounded-lg cursor-pointer"
          onClick={addNote}
        >
          <h1 className="text-[50px]">+</h1>
        </div>
      </div>
    </div>
  );
}
