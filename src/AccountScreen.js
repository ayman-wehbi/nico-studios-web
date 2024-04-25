import React, { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, updateDoc, addDoc} from 'firebase/firestore';
import { firestore, auth} from './firebase'; // Ensure this points to your web setup of Firebase
import './AccountScreen.css'; 


const SongsListWeb = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [allSongs, setAllSongs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState({ title: '', content: '' });
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState(selectedSong.title);
  const [content, setContent] = useState(selectedSong.content);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [isProjectCreationModalOpen, setIsProjectCreationModalOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);

  
  const selectedProject = projects.find(project => project.id === selectedProjectId);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = doc(firestore, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setFirstName(userSnap.data().firstName);
                setLastName(userSnap.data().lastName);
                setUsername(userSnap.data().username);
                
            } else {
                console.log("No such document!");
            }
        } else {
            // User is signed out
            navigate("/"); // Ensure the path is correctly specified according to your routing setup
        }
    });

    return () => unsubscribe(); // Ensure you're calling the unsubscribe function correctly
  }, [navigate]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-menu')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/');
      } else {
        await fetchSongs();
        await fetchProjects();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const createSong = () => {
    // Reset fields for new song creation
    setSelectedSong({ title: '', content: '' }); // Ensure the modal opens with empty inputs
    setTitle(''); // Clear any previous title
    setContent(''); // Clear any previous content
    setIsModalOpen(true); // Open the modal for new song input
  };

  const CreationOptionsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-option-button" onClick={() => {
                    setIsModalOpen(true);
                    setIsCreationModalOpen(false);
                }}>Create Song</button>
                <button className="modal-option-button" onClick={() => {
                    setIsProjectCreationModalOpen(true);
                    setIsCreationModalOpen(false);
                }}>Create Project</button>
            </div>
        </div>
    );
  };


  const fetchProjects = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const projectsRef = collection(firestore, 'users', user.uid, 'projects');
      const snapshot = await getDocs(projectsRef);
      const projectsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsList);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      console.log("Project name is required");
      return;
    }
    try {
      const projectsRef = collection(firestore, 'users', auth.currentUser.uid, 'projects');
      const docRef = await addDoc(projectsRef, {
        name: newProjectName,
        createdAt: new Date() // Optional: store creation date
      });
      console.log(`New project added with ID: ${docRef.id}`);
      setProjects([...projects, { id: docRef.id, name: newProjectName }]);
      setNewProjectName(''); // Reset the input field after submission
      setIsProjectCreationModalOpen(false);
    } catch (error) {
      console.error("Error adding new project:", error);
    }
  };

  const handleChange = useCallback((e) => {
    setNewProjectName(e.target.value);
  }, []);

  const ProjectCreationModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handlePTitleChange = (event) => {
      const { value } = event.target;
      debounce(() => setTitle(value))();
    }
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content-createProject" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="input-createProject"
            placeholder="Project Name"
          />
          <button className="modal-save-button" onClick={handleCreateProject}>
            Create Project
          </button>
        </div>
      </div>
    );
  };
  
  const fetchSongs = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const songsRef = collection(firestore, 'users', user.uid, 'songs');
      try {
        const snapshot = await getDocs(songsRef);
        let songsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        songsList = songsList.sort((a, b) => a.title.localeCompare(b.title));
        setSongs(songsList);
        setAllSongs(songsList);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      }
    }
  };
  // This effect depends on title and content
  
    // Your input handlers remain the same
    const handleTitleChange = (e) => {
      setTitle(e.target.value);
    };
  
    const handleContentChange = (e) => {
      setContent(e.target.value);
    };

  const fetchSongsForProject = async (projectId) => {
    const path = `users/${auth.currentUser.uid}/projects/${projectId}`;
    const projectRef = doc(firestore, path);
    const projectSnap = await getDoc(projectRef);
  
    if (projectSnap.exists()) {
      const projectData = projectSnap.data();
      console.log(projectData); // Debug: See what the project data looks like
      const projectSongIds = projectData.songs || []; // Fallback to an empty array if undefined
      console.log(projectSongIds); // Debug: Check the song IDs
  
      const filteredSongs = allSongs.filter(song => projectSongIds.includes(song.id));
      setSongs(filteredSongs);
    } else {
      console.log("No such project!");
      setSongs([]); // Clear the songs list if the project doesn't exist or has no songs
    }
  };

  const handleCreateSong = () => {
    // Implement song creation logic here
    console.log("Create Song Clicked");
  };

  const addSongToProject = async (project) => {
    console.log(`Attempting to add song to project:`, project);
  
    // Convert 'project.id' to a string to ensure compatibility with Firestore.
    const projectId = String(project.id);
  
    // Ensuring that 'auth.currentUser.uid' is a string.
    if (typeof auth.currentUser.uid !== 'string') {
      console.error("User UID is not a string:", auth.currentUser.uid);
      return;
    }
  
    // Constructing the document reference with a string projectId
    try {
      const projectRef = doc(firestore, 'users', auth.currentUser.uid, 'projects', projectId);
      const projectSnap = await getDoc(projectRef);
  
      if (projectSnap.exists()) {
        const projectData = projectSnap.data();
        let projectSongIds = Array.isArray(projectData.songs) ? projectData.songs : [];
  
        if (!projectSongIds.includes(selectedSong.id)) {
          projectSongIds.push(selectedSong.id);
          await updateDoc(projectRef, { songs: projectSongIds });
          console.log(`Song '${selectedSong.title}' successfully added to '${project.name}'.`);
        } else {
          console.log(`Song '${selectedSong.title}' is already in '${project.name}'.`);
        }
      } else {
        console.error(`Project '${projectId}' not found.`);
      }
    } catch (error) {
      console.error("Error adding song to project:", error);
    }
  };
  
  const handlePlusIconClick = () => {
    setIsProjectModalOpen(true);
    setIsModalOpen(false); // Open the project list modal
  };  

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };  

  const DropdownMenu = () => (
    <div className='dropdownoverlay'>
      <div className="dropdown-menu">
        <h4>Hi, {username}</h4>
        <button className='dropbutton' onClick={handleLogout}>Logout</button> 
        {/* Add more options as needed */}
      </div>
    </div>
  );  

  const ProjectListModal = ({ isOpen, onClose, addSongToProject, projects }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <ul>
            {projects.map((project) => (
              <li key={project.id} onClick={() => addSongToProject(project)}>
                {project.name}
              </li>
            ))}
          </ul>
          <button className="modal-close-button" onClick={onClose}>
            <i className="fas fa-times"></i> {/* Close icon */}
          </button>
        </div>
      </div>
    );
  };  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    song.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSongSelect = (song) => {
    setSelectedSong(song);
    setIsModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Use replace to navigate to login screen, replacing the current history entry
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  const Modal = ({ isOpen, onClose, song }) => {
   // Initialize state and effects at the top, before any conditional logic
   const [title, setTitle] = useState(song.title);
   const [content, setContent] = useState(song.content);
   const titleInputRef = useRef(null);
   const contentInputRef = useRef(null);
   
 
   useEffect(() => {
     setTitle(song.title);
     setContent(song.content);
   }, [song]);

   //DEBOUNCE FUNCTION BELOW NOT FUNCTIONING PROPERLY. LOSES FOCUS ON TEXT BASICALLY
   /*
   const debouncedSave = useCallback(debounce(async (title, content) => {
    if (!selectedSong || !selectedSong.id) {
      console.error("No song selected or song ID is missing.");
      return;
    }
  
    const songRef = doc(firestore, 'users', auth.currentUser.uid, 'songs', selectedSong.id);
  
    try {
      await updateDoc(songRef, { title, content });
      console.log("Auto-saved successfully.");
  
      // Only update if changes are made
      setSongs(prevSongs => prevSongs.map(song => song.id === selectedSong.id ? { ...song, title, content } : song));
      
      // Update only if selectedSong changes
      setSelectedSong(prevSelected => prevSelected.id === selectedSong.id ? { ...prevSelected, title, content } : prevSelected);
  
    } catch (error) {
      console.error("Error auto-saving song:", error);
    }
  }, 500), [selectedSong, setSongs, setSelectedSong]);
  
 
   // Auto-save effect
   const enableEffect = false; 
   useEffect(() => {
     if (isOpen) {
       debouncedSave(title, content);
       console.log('Effect running', { title, content, isOpen });
     }
     // Cleanup to cancel any debounced calls
     return () => debouncedSave.cancel();
   }, [title, content, isOpen, debouncedSave, enableEffect]);*/
 
   // Now, after all hooks have been called, you can conditionally render your component
   if (!isOpen) {
     return null;
   }
 
    // Handlers for input changes
    const handleTitleChange = (event) => {
      const { value } = event.target;
      debounce(() => setTitle(value))();
    }
    const handleContentChange = (event) => {
      const { value } = event.target;
      debounce(() => setContent(value))();
    };
  
    // Save changes here, e.g., update the state in the parent component or make an API call
    const handleSave = async () => {
      if (!selectedSong.id) {
          // This is a new song, no ID is present
          try {
              const songsRef = collection(firestore, 'users', auth.currentUser.uid, 'songs');
              const docRef = await addDoc(songsRef, {
                  title: title,
                  content: content,
                  projectId: selectedProjectId, // make sure this is managed correctly
                  createdAt: new Date()
              });
              console.log(`New song added with ID: ${docRef.id}`);
              setSongs([...songs, {...selectedSong, id: docRef.id, title, content}]);
              setIsModalOpen(false); // Close the modal after saving
          } catch (error) {
              console.error('Error adding new song:', error);
          }
      } else {
          // Existing song, update it
          try {
              const songRef = doc(firestore, 'users', auth.currentUser.uid, 'songs', selectedSong.id);
              await updateDoc(songRef, { title, content });
              console.log("Song updated successfully.");
  
              // Update the local state
              const updatedSongs = songs.map(song => {
                  if (song.id === selectedSong.id) {
                      return { ...song, title, content };
                  }
                  return song;
              });
              setSongs(updatedSongs);
              setIsModalOpen(false); // Close the modal after saving
          } catch (error) {
              console.error("Error updating song:", error);
          }
      }
  };
  
    
    
    
  
    return (
      <div className="modal-overlay">
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="modal-title-input"
            placeholder="Song Title"
          />
          <textarea
            ref={contentInputRef}
            value={content}
            onChange={handleContentChange}
            className="modal-lyrics-input"
            placeholder="Song Lyrics"
            rows="10" // Adjust based on your preference
          ></textarea>
          <div className="modal-actions">
          <div className="modal-actions-right">
            <button className="modal-save-button" onClick={handleSave}>
              <i className="fas fa-save"></i> {/* Save Icon */}
            </button>
            <button className="modal-save-button" onClick={handlePlusIconClick}>
              <i className="fas fa-plus"></i> {/* Plus Icon */}
            </button>
            <button className="modal-save-button" onClick={handleSave}>
              <i className="fas fa-trash-alt"></i> {/* Delete Icon */}
            </button>
        </div>
            <button className="modal-save-button" onClick={handleSave}>
               <i className="fas fa-times"></i> {/*exit*/}
            </button>
          </div>
        </div>
      </div>
    );
  };
  

  return (    
    <div>          
      <div className="toolbar">
        <h1 className="header">NICO STUDIOS</h1>
        <input
          className="search-bar"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button onClick={() => setIsCreationModalOpen(true)} className="create-option-button">Create</button>
        <button className="modal-save-button" onClick={toggleDropdown}>
          <i className="fas fa-cog"></i> {/* Settings icon */}
        </button>
        
        {isDropdownOpen && <DropdownMenu />}
        
      </div>
      <CreationOptionsModal isOpen={isCreationModalOpen} onClose={() => setIsCreationModalOpen(false)} />
      <div className="tool-div"></div> {/* Style for the dividing line */}
      <div className="app-container">
      <ProjectCreationModal isOpen={isProjectCreationModalOpen} onClose={() => setIsProjectCreationModalOpen(false)} />
        <ProjectListModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          addSongToProject={addSongToProject}
          projects={projects}
        />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} song={selectedSong} />
  
      <div className="sidebar">
        <h2 >Projects</h2>
        <ul>
          {projects.map(project => (
            <li key={project.id} onClick={() => {
              console.log("Project Selected:", project.id);
              setSelectedProjectId(project.id);
              fetchSongsForProject(project.id);
            }}>
              {project.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        

        <div className="songs-list" >
          <div className='song-list-header'>
            <h1>{selectedProject ? selectedProject.name : 'Songs'}</h1>
            <div className="allSongs-div">
              <button className="allSongs-button" onClick={fetchSongs}>
                  <p>All Songs</p> {/* Settings icon */}
              </button>
            </div>
          </div> {/* Dynamically change header */}
          {filteredSongs.length > 0 ? (
            <ul>
              {filteredSongs.map(song => (
                <li key={song.id} onClick={() => handleSongSelect(song)}>
                  <div className="song-card">
                    <div className="song-title">{song.title}</div>
                    <div className="song-lyrics">{song.content ? `${song.content.substring(0, 200)}...` : "No lyrics available"}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No songs found.</p>
          )}
        </div>
      </div>
    </div>
  </div>
  )};
  

export default SongsListWeb;
