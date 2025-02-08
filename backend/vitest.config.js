// Imports the defineConfig function from Vitest to configure the test environment
import { defineConfig } from 'vitest/config';

// Exports the Vitest configuration
export default defineConfig({
  test: {
    environment: 'node', // Sets the test environment to Node.js

    threads: false, // Disables worker threads to avoid potential issues with concurrency in tests

    globals: false, // Disables global variables 

    exclude: [
      'vitest.config.js', // Excludes this config file from tests
      'node_modules',      // Ignores dependencies folder
      'dist',              // Ignores the build output directory
      '.git',              // Ignores Git repository metadata
      '.cache'             // Ignores any cached files
    ],

    snapshotFormat: {
      printBasicPrototype: true, // Ensures snapshot comparisons include basic object prototypes
      escapeString: true,        // Escapes special characters in snapshot strings for better consistency
    },

    coverage: {
      provider: 'c8', // Uses the 'c8' library for generating code coverage reports
    },
  },
});
