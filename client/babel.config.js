module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Tamagui babel plugin disabled due to React 19 compatibility issues
      // The plugin's static extraction uses react-dom internals incompatible with React 19
      // Tamagui still works without the plugin, just without build-time optimizations
      // 'react-native-reanimated/plugin', // Add this later if you use Reanimated
    ],
  };
};
