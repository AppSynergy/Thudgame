/** @type {import('stylelint').Config} */
export default {
  plugins: ["stylelint-no-unused-selectors"],
  rules: {
    "plugin/no-unused-selectors": true,
    "block-no-empty": true,
    "no-duplicate-selectors": true,
  },
};
