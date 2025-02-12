
module.exports = {
  env: {
    browser: true,
    node: true,
  },
  overrides: [
    {
      files: ['tests/**/*'],
      env: {
        jest: true,  // This enables the Jest global variables in test files
      },
    },
  ],
};