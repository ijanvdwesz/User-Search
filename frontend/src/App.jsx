import React, { useState } from 'react'; // Imports React and the useState hook for managing component state
import UserSearch from './UserSearch.jsx'; // Imports the UserSearch component
import UserProfile from './UserProfile.jsx'; // Imports the UserProfile component
import './styles/App.css'; // Imports the external CSS file for styling

const App = () => {
  // State that stores the username entered by the user
  const [username, setUsername] = useState('');

  return (
    <div>
      {/* Main heading of the app */}
      <h1>GitHub User Search</h1>
      
      {/* Renders the UserSearch component and passes setUsername as a prop */}
      <UserSearch setUsername={setUsername} />
      
      {/* Renders the UserProfile component with the username,if a username is set */}
      {username && <UserProfile username={username} />}
    </div>
  );
};

export default App; // Exports the App component