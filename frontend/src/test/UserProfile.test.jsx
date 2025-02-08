import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserProfile from '../UserProfile';

// Mocks the Commits module to prevent real API calls and simplify testing.
jest.mock('../Commits', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked Commits Component</div>),
  fetchCommits: jest.fn().mockResolvedValue([]),
}));

// Sample user data thats used in test cases.
const mockUserData = {
  profile: {
    login: 'octocat',
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    followers: 4900,
    following: 9,
    public_repos: 5,
    bio: 'This is your friendly neighborhood octocat.',
  },
  repos: [
    {
      id: 1,
      name: 'Hello-World',
      description: 'A sample repository',
      html_url: 'https://github.com/octocat/Hello-World',
      created_at: '2022-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      readme_url: 'https://github.com/octocat/Hello-World/blob/main/README.md',
    },
    {
      id: 2,
      name: 'Spoon-Knife',
      description: 'Another sample repository',
      html_url: 'https://github.com/octocat/Spoon-Knife',
      created_at: '2021-05-01T00:00:00Z',
      updated_at: '2023-02-01T00:00:00Z',
    },
  ],
};

// Resets all mocks and sets up a fetch mock response ,before each test.
beforeEach(() => {
  jest.clearAllMocks();
  global.fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockUserData),
  });
});

describe('UserProfile Component', () => {
  // Test to ensure user profile data is fetched and displayed correctly.
  it('fetches and displays user profile data correctly', async () => {
    render(<UserProfile username="octocat" />);

    // Calls fetch to user api
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/users/octocat'));

    // Ensures loading message disappears and profile details are displayed.
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('octocat')).toBeInTheDocument();
      expect(screen.getByText(/Followers: 4900/)).toBeInTheDocument();
      expect(screen.getByText(/Following: 9/)).toBeInTheDocument();
      expect(screen.getByText(/Public Repos: 5/)).toBeInTheDocument();
      expect(screen.getByText(/This is your friendly neighborhood octocat\./)).toBeInTheDocument();
    });
  });

  // Test that checks if the user's avatar is rendered correctly.
  it('renders the profile avatar with correct alt text', async () => {
    render(<UserProfile username="octocat" />);

    // Waits for data fetch completion.
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/users/octocat'));
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    // Validates that the avatar image is displayed with correct properties.
    await waitFor(() => {
      const avatar = screen.getByAltText('octocat avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar.src).toBe('https://avatars.githubusercontent.com/u/583231?v=4');
    });
  });

  // Test that checks if repositories are displayed in a dropdown and can be selected.
  it('displays repositories in a dropdown and allows selection', async () => {
    render(<UserProfile username="octocat" />);

    // Waits for data fetch completion.
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/users/octocat'));
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    
    // Validates dropdown and repository names.
    await waitFor(() => {
      const dropdown = screen.getByRole('combobox');
      expect(dropdown).toBeInTheDocument();
      expect(screen.getByText('Hello-World')).toBeInTheDocument();
      expect(screen.getByText('Spoon-Knife')).toBeInTheDocument();
    });

    // Simulates user selecting "Hello-World" repository from dropdown.
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Hello-World' },
    });

    // Validates that the repository details update accordingly.
    await waitFor(() => {
      expect(screen.getByText('Repository Details:')).toBeInTheDocument();
      const nameElement = screen.getByText(/Name:/).parentElement;
      expect(nameElement?.textContent.trim()).toContain('Hello-World');
    });
  });

  // Tests to ensure the component gracefully handles empty or missing user data.
  it('handles empty user data gracefully', async () => {
    // Forces fetch to return empty profile and repository data.
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ profile: {}, repos: [] }),
    });

    render(<UserProfile username="octocat" />);

    // Waits for the fetch call and ensures an error message is displayed.
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/users/octocat'));
    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });
});
