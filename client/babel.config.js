module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './src/config/tamagui.config.ts',
          logTimings: true,
          disableExtraction: true, // Disable static extraction to avoid config parsing issues
        },
      ],
      // 'react-native-reanimated/plugin', // Add this later if you use Reanimated
    ],
  };
};
