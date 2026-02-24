import { useState } from "react";

const NewNote = ({ createNote }) => {

  const [newNote, setNewNote] = useState("");

  const addNote = (event) => {
    event.preventDefault()
    createNote({
        content :newNote,
        important : Math.random() > 0.5
    })

    setNewNote('')
  }

  return (
    <>
    <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          id="note-input"
          value={newNote}
          placeholder="Writr your notes here"
          onChange={event => setNewNote(event.target.value)}
        />
        <button type="submit">save</button>
      </form>
    </>
  )
};

export default NewNote;
