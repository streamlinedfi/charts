import svgr from 'esbuild-plugin-svgr';
import { readFileSync } from 'fs';
import MomentTimezoneDataPlugin from 'moment-timezone-data-webpack-plugin';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.js'],
  format: ['cjs', 'esm'],
  dts: false,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: true,
  metafile: true,
  target: 'es2020',
  outDir: 'dist',
  external: ['react', 'react-dom', 'styled-components'],
  drop: [],
  loader: {
    '.js': 'jsx',
  },
  esbuildPlugins: [
    {
      name: 'inline-svg-dataurl',
      setup(build) {
        build.onLoad({ filter: /\.inline$/ }, async args => {
          const svg = readFileSync(args.path, 'utf8');
          const base64 = Buffer.from(svg).toString('base64');
          const dataUrl = `data:image/svg+xml;base64,${base64}`;
          return {
            contents: `export default "${dataUrl}"`,
            loader: 'js',
          };
        });
      },
    },
    svgr({
      svgo: true,
      svgoConfig: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
        ],
      },
    }),
    {
      name: 'moment-timezone-data',
      setup(build) {
        const originalPlugin = new MomentTimezoneDataPlugin({
          matchZones: ['US/Eastern', 'America/New_York'],
        });

        // Forward the original plugin's setup() to esbuild
        if (originalPlugin.setup) {
          originalPlugin.setup(build);
        }
      },
    },
  ],
  outExtension({ format }) {
    return { js: format === 'esm' ? '.mjs' : '.cjs' };
  },
});
