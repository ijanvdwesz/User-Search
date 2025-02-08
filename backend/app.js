// Import required modules
import express from 'express'; // Express framework for creating web applications
import fetch from 'node-fetch'; // Fetch API for making HTTP requests
import dotenv from 'dotenv'; // To load environment variables from a .env file
import helmet from 'helmet'; // Helmet helps secure the app by setting various HTTP headers

// Loads environment variables(GithubToken) from a .env file
dotenv.config();

// Initializes the Express app
const app = express();

// GitHub API URL and token from environment variables
const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// If GitHub Token is missing, log an error and exit the process
if (!GITHUB_TOKEN) {
  console.error("GitHub Token is missing");
  process.exit(1);  // Exits process if token is missing
}

// Middleware that parses incoming JSON requests and adds security headers
app.use(express.json());
app.use(helmet()); // Helmet is used to set various HTTP headers for security

// Helper function that fetches data from the GitHub API with error handling
const fetchGitHubData = async (url) => {
  const response = await fetch(`${GITHUB_API_URL}${url}`, {
    headers: { 'Authorization': `token ${GITHUB_TOKEN}` },
  });

  // Checks if GitHub API rate limit is exceeded
  const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
  if (rateLimitRemaining === '0') {
    throw new Error('GitHub API rate limit exceeded');
  }

  // Checks if response is OK, else throws an error
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch from GitHub API');
  }

  return response.json(); // Returns the response in JSON format
};

// Route that checks if the server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// API endpoint that searches GitHub users by query
app.get('/api/search/users', async (req, res) => {
  const { query } = req.query;
  
  // If no query is provided, returns a 400 error
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  try {
    const data = await fetchGitHubData(`/search/users?q=${query}`); // Fetches user data from GitHub API
    res.json({
      total_count: data.total_count,  // Total number of users found
      items: data.items,  // Array of user items
    });
  } catch (error) {
    res.status(404).json({ error: error.message || 'Failed to fetch data from GitHub' });
  }
});

// API endpoint to fetch details of a specific GitHub user
app.get('/api/users/:username', async (req, res) => {
  const { username } = req.params; // Gets the username from the URL parameter
  try {
    const userDetails = await fetchGitHubData(`/users/${username}`); // Fetches user details
    const repos = await fetchGitHubData(`/users/${username}/repos`); // Fetches repositories of the user
    
    if (!userDetails) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ profile: userDetails, repos }); // Sends user profile and repos as response
  } catch (error) {
    res.status(404).json({ error: error.message || 'Failed to fetch user details' });
  }
});

// API endpoint that fetches details of commits for a specific repository
app.get('/api/repos/:username/:repo', async (req, res) => {
  const { username, repo } = req.params; // Gets username and repository name from URL parameters
  try {
    const commits = await fetchGitHubData(`/repos/${username}/${repo}/commits`); // Fetches commits for the repo
    
    if (!commits || commits.length === 0) {
      return res.status(404).json({ error: 'No commits found for this repository' });
    }

    // Maps commit details to return only necessary information (committer name, message, and date)
    const commitDetails = commits.slice(0, 5).map(commit => ({
      committer_name: commit.commit.author.name,
      message: commit.commit.message,
      date: commit.commit.author.date,
    }));

    res.json({ commits: commitDetails }); // Sends commit details as response
  } catch (error) {
    res.status(404).json({ error: error.message || 'Failed to fetch commits' });
  }
});

// Exports the app to be used in server.js
export default app;
