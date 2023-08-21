import commonjs from "@rollup/plugin-commonjs";
import postcss from 'rollup-plugin-postcss';
import dsv from "@rollup/plugin-dsv";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";

import pkg from "./package.json" assert { type: "json" };

export default {
  input: "src/index.js",
  plugins: [
    postcss({
      inject: true, // This will inject the CSS to the HTML document
    }),
    dsv(),
    json(),
    nodeResolve({
      preferBuiltins: true,
    }),
    terser(),     
    commonjs(),
  ],
  output: [
    {
      name: "@bdelab/roar-anb",
      file: pkg.module,
      format: "es",
    },
  ],
};