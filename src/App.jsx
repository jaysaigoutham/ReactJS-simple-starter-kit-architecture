import { useState, useEffect, useRef } from "react";
import Footer from "./components/Footer";
import Note from "./components/Note";
import Notification from "./components/Notification";
import noteService from "./services/note";
import loginServie from "./services/login";
import LoginForm from "./components/login/loginForm";
import NoteForm from "./components/Note/noteForm";
import Togglable from "./components/common/togglable";
import NewNote from "./components/note/newNote";

const App = () => {
  const [notes, setNotes] = useState([]);

  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // obselete
  // const [newNote, setNewNote] = useState("");
  // const [loginVisible, setLoginVisible] = useState(false);

  const useFormRef = useRef()

  useEffect(() => {
    noteService
      .getAll()
      .then((initialNotes) => {
        setNotes(initialNotes);
      })
      .catch((error) => {
        console.error("Failed to fetch notes:", error);
        setErrorMessage("Failed to load notes from server");
        setNotes([]);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const addNote = (noteObject) => {
    

    useFormRef.current.toggleVisibility()
    
    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
  
    });
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`,
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginServie.login({ username, password });
      noteService.setToken(user.token);

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));

      setUser(user);
      setUsername("");
      setPassword("");
    } catch {
      setErrorMessage("Inocrrect Credentails");
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };


  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const noteForm = () => {
    return (
      <Togglable buttonLabel="New label" ref="{useFormRef}">

        <newNote
          createNote = {addNote}/>
        {/* <NoteForm
          onSubmit={addNote}
          handleChange={handleNoteChange}
          value={newNote}
        ></NoteForm> */}
      </Togglable>
    );
  };

  const loginForm = () => {
    return (
      <>
        <Togglable buttonLabel="login here">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          ></LoginForm>
        </Togglable>
      </>
    );
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow?.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  );
};

export default App;
