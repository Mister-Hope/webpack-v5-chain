import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { Config } from "../src/index.js";

const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");

// The README slice between two headings.
const section = (from: string, to: string): string => {
  const start = readme.indexOf(from);
  const end = readme.indexOf(to, start + from.length);

  if (start === -1) throw new Error(`README has no "${from}" heading`);
  if (end === -1) throw new Error(`README has no "${to}" heading`);

  return readme.slice(start, end);
};

// Every chain-method name referenced by the given markdown.
// The leading dot sits in a lookbehind so no capture group is needed.
const references = (markdown: string): string[] =>
  markdown.match(/(?<=\.)[A-Za-z_$][\w$]*(?=[\s(`,])/gu) ?? [];

// Every identifier in the given code.
const identifiers = (code: string): string[] => code.match(/[A-Za-z_$][\w$]*/gu) ?? [];

// The `config.merge({...})` code block of the merge schema section.
const mergeSchema = (): string => {
  const match = /```js\nconfig\.merge\(\{\n(?<body>[\s\S]*?)\n\}\)\n```/u.exec(
    section("## Merging Config\n", "## Conditional Configuration\n"),
  );
  const body = match?.groups?.body;

  if (!body) throw new Error("README has no merge schema code block");

  return body;
};

const config = new Config();
const rule = config.module.rule("sample");

/** Each chainable container along with the README section documenting its shorthand methods. */
const sections = [
  {
    name: "config",
    keys: config.shorthands,
    from: "#### Shorthand methods\n",
    to: "#### Entry points\n",
  },
  {
    name: "config.output",
    keys: config.output.shorthands,
    from: "#### Output\n",
    to: "#### Resolve\n",
  },
  {
    name: "config.resolve",
    keys: config.resolve.shorthands,
    from: "#### Resolve\n",
    to: "#### Resolve plugins\n",
  },
  {
    name: "config.optimization",
    keys: config.optimization.shorthands,
    from: "#### Optimization\n",
    to: "#### Plugins\n",
  },
  {
    name: "config.devServer",
    keys: config.devServer.shorthands,
    from: "#### DevServer\n",
    to: "#### Module\n",
  },
  {
    name: "config.module",
    keys: config.module.shorthands,
    from: "#### Module\n",
    to: "#### Module rules\n",
  },
  {
    name: "config.module.rule",
    keys: rule.shorthands,
    from: "#### Module rules\n",
    to: "#### Rule uses (loaders)\n",
  },
  {
    name: "config.module.rule.use",
    keys: rule.use("sample").shorthands,
    from: "#### Rule uses (loaders)\n",
    to: "## Merging Config\n",
  },
  {
    name: "config.plugin",
    keys: config.plugin("sample").shorthands,
    from: "#### Plugins\n",
    to: "#### DevServer\n",
  },
  {
    name: "config.performance",
    keys: config.performance.shorthands,
    from: "#### Performance\n",
    to: "#### Optimization\n",
  },
];

describe("rEADME", () => {
  it.each(sections)("documents all $name shorthand methods", ({ name, keys, from, to }) => {
    const documented = new Set(references(section(from, to)));
    const missing = keys.filter((key) => !documented.has(key));

    expect(missing, `README is missing ${name} shorthand methods`).toStrictEqual([]);
  });

  it("documents the extra resolveLoader shorthand methods", () => {
    const markdown = section("#### ResolveLoader\n", "#### Performance\n");
    const documented = new Set(references(markdown));
    // `config.resolveLoader` reuses `config.resolve`, only its extra keys are listed.
    const missing = ["modules", "moduleExtensions", "packageMains"].filter(
      (key) => !documented.has(key),
    );

    expect(missing, "README is missing config.resolveLoader shorthand methods").toStrictEqual([]);
    expect(markdown).toContain("config.resolve");
  });

  it("documents all top-level config keys in the merge schema", () => {
    const documented = new Set(identifiers(mergeSchema()));
    const missing = config.shorthands.filter((key) => !documented.has(key));

    expect(missing, "README merge schema is missing top-level config keys").toStrictEqual([]);
  });
});
