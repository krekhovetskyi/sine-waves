import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './tests/coverage',
      include: ['src/**/*.js'],
      exclude: ['src/lib/**', 'tests/**']
    },
    include: ['tests/specs/**/*.js'],
    setupFiles: ['./tests/setup.js']
  }
});
