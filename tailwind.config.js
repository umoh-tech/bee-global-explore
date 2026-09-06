/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './admin/*.html'],
  safelist: [
    // Dynamically-inserted classes (built into strings in main.js/admin.js)
    // that the content scanner can't see, since they never appear literally
    // in any .html file.
    'hidden', 'open', 'active', 'inactive', 'invalid', 'show', 'in',
    'dragover', 'selected',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0E1B2E',
        navy: '#12213B',
        navy2: '#17294A',
        honey: '#E8A33D',
        honeylight: '#F4C877',
        teal: '#3F7C74',
        paper: '#F8F4EB',
        papershade: '#EFE8D8',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    }
  },
  plugins: [],
}
