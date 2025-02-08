import React, { useState } from 'react'; // Imports React and the useState hook
import './styles/UserSearch.css'; // Imports styles for the UserSearch component

// Defines the loading spinner image path from the public folder
const LoadingSpinner = `${process.env.PUBLIC_URL}/Loading-Spinner.gif`;

const UserSearch = ({ setUsername }) => {
  // State that manages input field value
  const [input, setInput] = useState('');

  // State that tracks whether loading spinner should be displayed
  const [isLoading, setIsLoading] = useState(false);

  // Function that handle user search
  const handleSearch = () => {
    if (input.trim()) {
      setIsLoading(true); // Shows loading spinner
      setTimeout(() => {
        setUsername(input); // Sets the searched username in the parent component
        setIsLoading(false); // Hides loading spinner after search completes
      }, 2000); // Simulates a 2-second loading delay
    }
  };

  return (
    <div className="user-search-container">
      {/* Input field for entering GitHub username */}
      <input
        className="user-search-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter GitHub username"
      />

      {/* Search button to trigger username search */}
      <button className="user-search-button" onClick={handleSearch}>
        Search
      </button>

      {/* Displays loading spinner while search is in progress */}
      {isLoading && (
        <div className="loading-container">
          <img src={LoadingSpinner} alt="Loading" className="loading-spinner" />
        </div>
      )}
    </div>
  );
};

export default UserSearch; // Exports UserSearch
