// Imports necessary testing utilities and components
import { render, screen, fireEvent } from '@testing-library/react'; // From Testing Library that renders and interact with components
import App from '../App';  // Imports the App component to test

// Mocks the UserSearch and UserProfile components for testing
jest.mock('../UserSearch.jsx', () => () => <div>UserSearch Component</div>); // Mocks UserSearch to return a div
jest.mock('../UserProfile.jsx', () => () => <div>UserProfile Component</div>); // Mocks UserProfile to return a div

// Groups the tests related to the App component
describe('App Component', () => {
  
  // Tests to check if the app renders correctly with all necessary components
  it('renders the app with the search and profile components', () => {
    
    // Renders the App component
    render(<App />);
    
    // Assert that the title "GitHub User Search" is rendered
    expect(screen.getByText(/GitHub User Search/i)).toBeInTheDocument();
    
    // Assert that the mocked UserSearch component is rendered
    expect(screen.getByText(/UserSearch Component/i)).toBeInTheDocument();
    
    // Initially, the UserProfile component should not be rendered,(checks that it is not in the document)
    expect(screen.queryByText(/UserProfile Component/i)).toBeNull();
  });

  // Tests that checks if the app matches the snapshot (helps detect UI changes)
  it('matches the snapshot', () => {
    
    // Renders the App component
    const { asFragment } = render(<App />);
    
    // Compares the rendered output to the saved snapshot
    expect(asFragment()).toMatchSnapshot();
  });

});
