// Imports the Express application instance from app.js 
import app from './app.js';

// Sets the server port
const port =5000;

// Starts the Express server and listens on the defined port
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`); // Logs the server URL when started
});
