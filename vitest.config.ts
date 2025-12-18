import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './tests/coverage',
      include: ['src/**/*.js', 'src/**/*.ts'],
      exclude: ['src/lib/**', 'tests/**']
    },
    include: ['tests/specs/**/*.js', 'tests/specs/**/*.ts'],
    setupFiles: ['./tests/setup.ts']
  }
});
