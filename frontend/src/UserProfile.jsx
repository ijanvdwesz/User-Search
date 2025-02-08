import React, { useState, useEffect } from 'react'; // Imports React and hooks for state and effects
import Commits from './Commits.jsx'; // Imports the Commits component
import './styles/UserProfile.css'; // Imports styles

const UserProfile = ({ username }) => {
  const [userData, setUserData] = useState(null); // State that stores user profile data
  const [repos, setRepos] = useState([]); // State that stores user repositories
  const [selectedRepo, setSelectedRepo] = useState(null); // State that tracks selected repository
  const [error, setError] = useState(null); // State that handles errors

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetches user profile and repositories from API
        const response = await fetch(`/api/users/${username}`);
        const data = await response.json();

        // Validates the fetched data before setting state
        if (!data.profile || !data.repos || Object.keys(data.profile).length === 0) {
          throw new Error('Data missing or malformed');
        }

        setUserData(data.profile); // Stores user profile data
        setRepos(data.repos); // Stores repositories
      } catch (err) {
        setError('Something went wrong'); // Sets error message on failure
        console.error(err);
      }
    };

    fetchUserData(); // Fetches user data when username changes
  }, [username]);

  // Handles repository selection from dropdown
  const handleRepoSelection = (event) => {
    const repoName = event.target.value;
    const repo = repos.find((repo) => repo.name === repoName);
    setSelectedRepo(repo);
  };

  // Displays error message if an error occurs
  if (error) {
    return <div>{error}</div>;
  }

  // Shows loading state while user data is being fetched
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-container">
      {/* Profile header section */}
      <div className="profile-header">
        <img src={userData.avatar_url} alt={`${userData.login} avatar`} />
        <div>
          <h2>{userData.login}</h2>
          <p>Followers: {userData.followers}</p>
          <p>Following: {userData.following}</p>
          <p>Public Repos: {userData.public_repos}</p>
        </div>
      </div>

      {/* Displays user bio if available */}
      {userData.bio && (
        <div className="user-bio">
          <h3>Bio:</h3>
          <p>{userData.bio}</p>
        </div>
      )}

      {/* Repository selection dropdown */}
      <div className="repo-dropdown-container">
        <h3>Repositories:</h3>
        <select
          className="repo-dropdown"
          onChange={handleRepoSelection}
          defaultValue="default"
        >
          <option value="default" disabled>
            Select a Repository
          </option>
          {repos.map((repo) => (
            <option key={repo.id} value={repo.name}>
              {repo.name}
            </option>
          ))}
        </select>
      </div>

      {/* Displays selected repository details */}
      {selectedRepo && (
        <div className="repo-details">
          <h4>Repository Details:</h4>
          <p>
            <strong>Name:</strong> {selectedRepo.name}
          </p>
          <p>
            <strong>Description:</strong>{' '}
            {selectedRepo.description || 'No description available'}
          </p>
          <p>
            <strong>Repository Link:</strong>{' '}
            <a
              className="repo-link"
              href={selectedRepo.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {selectedRepo.html_url}
            </a>
          </p>

          {/* Displays README link if available */}
          {selectedRepo.readme_url && (
            <p>
              <strong>README:</strong>{' '}
              <a
                className="readme-link"
                href={selectedRepo.readme_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View README
              </a>
            </p>
          )}

          {/* Shows repository creation and last update dates */}
          <p>
            <strong>Created at:</strong>{' '}
            {new Date(selectedRepo.created_at).toLocaleDateString()}
          </p>
          <p>
            <strong>Last updated:</strong>{' '}
            {new Date(selectedRepo.updated_at).toLocaleDateString()}
          </p>

          {/* Displays commit history for the selected repository */}
          <Commits username={username} repo={selectedRepo.name} />
        </div>
      )}
    </div>
  );
};

export default UserProfile; // Exports UserProfile component
