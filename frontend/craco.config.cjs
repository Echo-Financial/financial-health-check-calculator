module.exports = {
  jest: {
    configure: (jestConfig) => {
      jestConfig.setupFiles = ["<rootDir>/src/canvasPolyfill.js"];
      jestConfig.transformIgnorePatterns = ["/node_modules/(?!axios)/"];
      jestConfig.moduleNameMapper = {
        "^unist-util-visit-parents/do-not-use-color$": "<rootDir>/node_modules/unist-util-visit-parents/index.js",
        "^#minpath$": "<rootDir>/__mocks__/minpathStub.js",  // if still needed
        "^#minproc$": "<rootDir>/__mocks__/minprocStub.js",  // if still needed
        "^react-markdown$": "<rootDir>/__mocks__/react-markdown.js"
      };
      return jestConfig;
    },
  },
};
