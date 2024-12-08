/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    "no-restricted-syntax": [
        "error",
        {
            message:
                "Do not import default from lodash-es. Use a namespace import (* as) instead.",
            selector:
                'ImportDeclaration[source.value="lodash-es"] ImportDefaultSpecifier',
        },      
    ],
},
};
