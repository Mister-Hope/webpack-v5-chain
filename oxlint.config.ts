import { defineConfig } from "oxlint";
import { defaultIgnorePatterns, getOxlintConfigs } from "oxc-config-hope/oxlint";

export default defineConfig({
  extends: getOxlintConfigs({
    vitest: {
      bench: true,
    },
  }),
  options: {
    typeAware: true,
    typeCheck: true,
  },
  ignorePatterns: defaultIgnorePatterns,
  rules: {
    "promise/prefer-await-to-callbacks": "off",
  },
  overrides: [
    {
      files: ["__tests__/**/*.ts"],
      rules: {
        "typescript/explicit-function-return-type": "off",
        "typescript/no-explicit-any": "off",
        "typescript/no-extraneous-class": "off",
        "typescript/no-unsafe-argument": "off",
        "typescript/no-unsafe-assignment": "off",
        "typescript/no-unsafe-call": "off",
        "typescript/no-unsafe-member-access": "off",
        "typescript/no-unsafe-return": "off",
        "no-shadow": "off",
      },
    },
  ],
});
