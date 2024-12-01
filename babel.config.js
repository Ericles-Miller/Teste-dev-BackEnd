module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@Api': './src/Api',
          '@Applications': './src/Applications',
          '@Domain': './src/Domain',
          '@Infra': './src/Infra',
          '@IoC': './src/IoC',
          '@UnitTests': './src/UnitTests',
        },
      },
    ],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
  ignore: [
    '**/*.spec.ts',
  ],
  overrides: [
    // ...
  ],
};