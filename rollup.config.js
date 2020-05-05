import commonjs from "rollup-plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

export default {
  input: "lib/compiled/index.js",
  output: {
    banner: "#!/usr/bin/env node",
    file: "./lib/DnD.js",
  },
  plugins: [
    json(),
    commonjs({
      include: ["./lib/compiled/index.js", "./node_modules/**"],
      ignoreGlobal: false,
    }),
    resolve(),
    terser(),
  ],
};
