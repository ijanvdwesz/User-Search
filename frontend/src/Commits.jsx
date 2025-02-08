import React, { useState, useEffect } from 'react'; // Imports React and hooks for state and side effects
import './styles/Commits.css'; // Imports the styles 

const Commits = ({ username, repo }) => {
  const [commits, setCommits] = useState([]); // State that stores commit data

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        // Fetches commit data from the API using the provided username and repo name
        const response = await fetch(`/api/repos/${username}/${repo}`);
        const data = await response.json();
        
        // Ensures commits data exists and is an array before updating state
        if (Array.isArray(data.commits)) {
          setCommits(data.commits);
        } else {
          setCommits([]); // Resets commits if data is invalid
        }
      } catch (error) {
        console.error('Error fetching commits:', error); // Logs errors for debugging
        setCommits([]); // Resets commits state in case of an error
      }
    };

    fetchCommits(); // Calls the fetch function when username or repo changes
  }, [username, repo]);

  return (
    <div>
      <h4>Commits for {repo}:</h4>
      {commits.length > 0 ? ( // Checks if there are commits to display
        <ul>
          {commits.map((commit, index) => (
            <li key={index}>
              <strong>{commit.committer_name}:</strong> {commit.message} {/* Displays commit author and message */}
              <p>
                <small>Committed on: {new Date(commit.date).toLocaleString()}</small> {/* Format commit date */}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No commits available for this repository.</p> // Shows message if no commits
      )}
    </div>
  );
};

export default Commits; // Exports component
