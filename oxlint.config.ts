import { defineHopeConfig } from "oxc-config-hope/oxlint";

export default defineHopeConfig(
  {
    ignore: [".ncurc.js"],
    rules: {
      "no-shadow": ["warn", { allow: ["config", "rule", "Plugin"] }],
      "promise/prefer-await-to-callbacks": "off",
    },
  },
  {
    files: ["__tests__/**/*.spec.js"],
    rules: {
      "typescript/no-extraneous-class": "off",
    },
  },
);
