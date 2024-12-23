module.exports = {
  jest: {
    configure: (jestConfig) => {
      jestConfig.transformIgnorePatterns = [
        "/node_modules/(?!axios)/",
      ];
      return jestConfig;
    },
  },
};
