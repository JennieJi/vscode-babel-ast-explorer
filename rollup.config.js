/**
 * @type {import('rollup').RollupOptions}
 */
const typescript = require('@rollup/plugin-typescript');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');

module.exports = {
  input: 'src/extension.ts',
  output: {
    dir: 'out',
    format: 'cjs',
    sourcemap: true,
    chunkFileNames: '[name].js',
    inlineDynamicImports: true
  },
  plugins: [typescript(), commonjs(), resolve()]
};