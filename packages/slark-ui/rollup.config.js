// import { globSync } from 'glob';
// import path from 'node:path';
// import ts from 'rollup-plugin-typescript2';
// import alias from '@rollup/plugin-alias';
// import { fileURLToPath } from 'node:url';

const { globSync } = require('glob');
const path = require('node:path');
const { fileURLToPath } = require('node:url');
const resolve = require('@rollup/plugin-node-resolve');
const ts = require('rollup-plugin-typescript2');
const packageJson = require('./package.json');
const alias = require('@rollup/plugin-alias');

// module.exports = {
// 	input: 'src/entities/list/connnector.ts',
// 	output: {
// 		file: 'bundle.js',
// 		format: 'cjs'
// 	}
// };;
// export default {};
// console.log(__dirname);
console.log(packageJson);
module.exports = {
	input: Object.fromEntries(
		globSync('src/**/*.ts').map(file => {
      // console.log(path.join(__dirname, file))//fileURLToPath(new URL(__dirname, file)));
      return [
        // 这里将删除 `src/` 以及每个文件的扩展名。
        // 因此，例如 src/nested/foo.js 会变成 nested/foo
        path.relative(
          'src',
          file.slice(0, file.length - path.extname(file).length)
        ),
        // 这里可以将相对路径扩展为绝对路径，例如
        // src/nested/foo 会变成 /project/src/nested/foo.js
        path.join(__dirname, file)
      ];
    })
	),
  watch: {
    include: 'src/**',
  },
	output: {
		format: 'es',
		dir: 'es'
	},
  plugins: [
    alias({
      entries: [
        { find: 'shared', replacement: path.resolve(__dirname, 'src/shared') }
      ]
    }),
    // resolve({
    //   // 选项
    //   extensions: ['.js', '.ts', '.jsx', '.tsx'], // 解析这些扩展名的文件
    // }),
    ts()
  ],
  // external: ['react/jsx-runtime', 'zustand/shallow', ...Object.keys(packageJson.dependencies)]
};