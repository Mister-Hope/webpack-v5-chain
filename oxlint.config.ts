import { defineHopeConfig } from "oxc-config-hope/oxlint";

export default defineHopeConfig(
  {
    ignore: [".ncurc.js"],
    rules: {
      "no-underscore-dangle": [
        "warn",
        {
          allow: [
            "__expression",
            "__before",
            "__after",
            "__ruleTypes",
            "__ruleNames",
            "__pluginName",
            "__pluginType",
            "__pluginConstructorName",
            "__pluginPath",
            "__pluginArgs",
            "__useName",
          ],
        },
      ],
      "no-shadow": ["warn", { allow: ["config", "rule", "Plugin"] }],
      "promise/prefer-await-to-callbacks": "off",
    },
  },
  {
    files: ["__tests__/**/*.spec.ts"],
    rules: {
      "typescript/no-extraneous-class": "off",
      "typescript/no-unsafe-argument": "off",
      "typescript/no-unsafe-call": "off",
      "typescript/no-unsafe-return": "off",
      "typescript/explicit-function-return-type": "off",
    },
  },
);
