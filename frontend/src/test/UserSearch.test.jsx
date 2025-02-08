import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserSearch from '../UserSearch';

// Mocks the setUsername function to track calls during testing
const mockSetUsername = jest.fn();

// Mocks user data example for potential reference in debugging
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

// Groups test cases under 'UserSearch Component'
describe('UserSearch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clears any previous mock calls before each test runs
  });

  it('renders the input field and search button', () => {
    render(<UserSearch setUsername={mockSetUsername} />);

    // Ensures input field and search button are present in the document
    expect(screen.getByPlaceholderText('Enter GitHub username')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('updates input field value when typing', () => {
    render(<UserSearch setUsername={mockSetUsername} />);

    // Simulates user typing 'testuser' into the input field
    fireEvent.change(screen.getByPlaceholderText('Enter GitHub username'), {
      target: { value: 'testuser' },
    });

    // Verifies that input field reflects the entered value
    expect(screen.getByPlaceholderText('Enter GitHub username').value).toBe('testuser');
  });

  it('shows a loading spinner when search is triggered', async () => {
    render(<UserSearch setUsername={mockSetUsername} />);

    // Simulates user entering text and clicking search
    fireEvent.change(screen.getByPlaceholderText('Enter GitHub username'), {
      target: { value: 'testuser' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    // Ensures the loading indicator appears
    expect(screen.getByAltText('Loading')).toBeInTheDocument();

    // Logs the mockUserData for debugging purposes
    console.log(mockUserData);

    // Waits for the mock function to be called and the spinner to disappear
    await waitFor(() => expect(mockSetUsername).toHaveBeenCalledWith('testuser'), { timeout: 15000 });
    expect(screen.queryByAltText('Loading')).not.toBeInTheDocument();
  });

  it('calls setUsername when the search button is clicked with valid input', async () => {
    render(<UserSearch setUsername={mockSetUsername} />);

    // Simulates entering a username
    fireEvent.change(screen.getByPlaceholderText('Enter GitHub username'), {
      target: { value: 'testuser' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    // Waits for async behavior to complete and verifies setUsername was called
    await waitFor(() => {
      expect(mockSetUsername).toHaveBeenCalledWith('testuser');
      expect(screen.queryByAltText('Loading')).not.toBeInTheDocument();
    }, { timeout: 3000 }); // Extended timeout to accommodate async actions
  });

  it('does not call setUsername if the input is empty', async () => {
    render(<UserSearch setUsername={mockSetUsername} />);

    // Clicks search without entering a username
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    // Ensures setUsername is never called
    await waitFor(() => expect(mockSetUsername).not.toHaveBeenCalled());
  });
});
