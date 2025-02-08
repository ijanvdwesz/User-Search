import { render, screen, waitFor } from '@testing-library/react';
import Commits from '../Commits';

// Mocks the global fetch function to prevent actual API calls during testing
global.fetch = jest.fn();

describe('Commits Component', () => {
  // Test case: Ensures that commit data is displayed correctly when fetched successfully
  it('displays commits when fetched successfully', async () => {
    // Mocked response data simulating commit history from an API
    const mockCommitsData = {
      commits: [
        {
          committer_name: 'John Doe',
          message: 'Initial commit',
          date: '2023-01-01T12:00:00Z'
        },
        {
          committer_name: 'Jane Smith',
          message: 'Added new feature',
          date: '2023-01-02T14:30:00Z'
        }
      ]
    };

    // Mocks fetch to return the mocked commit data
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockCommitsData)
    });

    // Renders the Commits component with test props
    render(<Commits username="testUser" repo="testRepo" />);

    // Waits for the commits to appear in the DOM before asserting
    await waitFor(() => {
      expect(screen.getByText(/Commits for testRepo:/i)).toBeInTheDocument(); // Checks if the main heading appears
      expect(screen.getByText(/Initial commit/i)).toBeInTheDocument(); // Checks if the first commit is displayed
      expect(screen.getByText(/Added new feature/i)).toBeInTheDocument(); // Checks if the second commit is displayed
    });
  });

  // Test case: Ensures that a message is displayed when no commits are found
  it('displays no commits message when no commits are available', async () => {
    // Mocked response data simulating an empty commit history
    const mockEmptyData = { commits: [] };

    // Mocks fetch to return an empty response
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockEmptyData)
    });

    // Renders the Commits component with test props
    render(<Commits username="testUser" repo="testRepo" />);

    // Waits for the message to appear in the DOM before asserting
    await waitFor(() => {
      expect(screen.getByText(/No commits available for this repository./i)).toBeInTheDocument(); // Checks if the no commits message appears
    });
  });
});
