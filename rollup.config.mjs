import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import del from 'rollup-plugin-delete'
import { dts } from 'rollup-plugin-dts'

export default defineConfig([
  {
    input: 'src/index.ts',
    output: { file: 'dist/index.d.ts', format: 'es' },
    plugins: [del({ targets: './dist/*' }), dts()],
  },

  {
    input: 'src/index.ts',
    output: [
      { format: 'cjs', file: './dist/index.cjs.js' },
      { format: 'es', file: './dist/index.esm.js' },
    ],
    plugins: [typescript({ declaration: false }), nodeResolve(), json(), commonjs()],
  },

  {
    input: 'src/index.ts',
    output: { format: 'umd', file: './dist/index.umd.js', extend: true, name: 'omn' },
    plugins: [typescript({ declaration: false }), nodeResolve(), json(), commonjs(), terser()],
  },
])
