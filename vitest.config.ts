import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Your test configuration options
    include: ['tests/**/*.test.ts'],
    root: '.',
    environment: 'node',
    globals: true,
    //setupFiles: ['./tests/db/utilities/testDBSetup.ts']
  },
});
