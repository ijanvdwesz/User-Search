// Imports necessary modules for testing
import { describe, it, expect } from 'vitest';  // Imports vitest functions for test structuring and assertions
import request from 'supertest';  // Imports supertest to simulate HTTP requests
import app from '../app.js';  // Imports the application (Express app)
import dotenv from 'dotenv';  // Imports dotenv for environment variable management
dotenv.config({ path: '.env.test' });  // Loads environment variables from '.env.test' file for testing

// Test suite for the 'GET /api/search/users' endpoint
describe('GET /api/search/users', () => {
  // Test case for valid user search query
  it('should return user search results for a valid query', async () => {
    const query = 'octocat'; // Example query for user search
    const response = await request(app).get(`/api/search/users?query=${query}`); // Sends GET request to the search endpoint
    expect(response.status).toBe(200);  // Expects status code 200 for successful search
    expect(response.body).toHaveProperty('total_count');  // Expects total_count in the response body
    expect(response.body).toHaveProperty('items');  // Expects items (user list) in the response body
    expect(response.body.items).toBeInstanceOf(Array);  // Ensures items is an array
  });

  // Test case for missing query parameter
  it('should return 400 if query parameter is missing', async () => {
    const response = await request(app).get(`/api/search/users`);  // Sends GET request without query parameter
    expect(response.status).toBe(400);  // Expects status code 400 for bad request
    expect(response.body.error).toBe('Query parameter is required');  // Expects error message about missing query
  });
});

// Test suite for the 'GET /api/users/:username' endpoint
describe('GET /api/users/:username', () => {
  // Test case for valid username (existing user)
  it('should return user profile and repos for a valid username', async () => {
    const username = 'octocat'; //  GitHub username used for testing 
    const response = await request(app).get(`/api/users/${username}`); // Sends GET request for user profile
    expect(response.status).toBe(200);  // Expects status code 200 for successful request
    expect(response.body).toHaveProperty('profile');  // Ensures the response contains profile information
    expect(response.body).toHaveProperty('repos');  // Ensures the response contains repositories list
    expect(response.body.profile).toHaveProperty('login', username); // Ensures the profile's login matches the username
  });

  // Test case for non-existent username
  it('should return 404 if the user does not exist', async () => {
    const username = 'nonexistentuser'; // Non-existent username
    const response = await request(app).get(`/api/users/${username}`); // Sends GET request for a non-existent user
    expect(response.status).toBe(404);  // Expects status code 404 for not found
    expect(response.body.error).toBe('Not Found');  // Expects error message indicating user not found
  });
});

// Test suite for the 'GET /api/repos/:username/:repo' endpoint
describe('GET /api/repos/:username/:repo', () => {
  // Test case for valid repository (existing repo)
  it('should return commits for a valid repository', async () => {
    const username = 'octocat'; // GitHubs test user
    const repo = 'Hello-World'; // Example repository name
    const response = await request(app).get(`/api/repos/${username}/${repo}`); // Sends GET request for repository commits
    expect(response.status).toBe(200);  // Expects status code 200 for successful request
    expect(response.body.commits).toBeInstanceOf(Array);  // Ensures the commits are returned as an array
    expect(response.body.commits.length).toBeGreaterThan(0);  // Ensures there is at least one commit
  });

  // Test case for non-existent repository
  it('should return 404 if the repository does not exist', async () => {
    const username = 'octocat'; // GitHubs test user
    const repo = 'nonexistent-repo'; // Non-existent repository
    const response = await request(app).get(`/api/repos/${username}/${repo}`); // Sends GET request for a non-existent repo
    expect(response.status).toBe(404);  // Expects status code 404 for not found
    expect(response.body.error).toBe('Not Found');  // Expects error message indicating repository not found
  });
});
