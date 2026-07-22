export default {
  cooldown: (pkg) => {
    if (
      ["@oxlint/", "@oxfmt", "@oxlint-tsgolint/", "@vitest/"].some((item) =>
        pkg.startsWith(item),
      ) ||
      ["oxc-config-hope", "oxfmt", "oxlint", "oxlint-tsgolint", "tsdown", "vitest"].includes(pkg)
    )
      return false;

    return 1;
  },
  upgrade: true,
  timeout: 360000,
  target: (name) => {
    if (name === "@types/node") return "minor";

    return "latest";
  },
};
