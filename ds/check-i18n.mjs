#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { compareDicts, t } from "./i18n.js";

const args = process.argv.slice(2);
const take = (flag) => args.flatMap((a, i) => (a === flag ? [args[i + 1]] : []));
const dictFiles = take("--dict"), htmlFiles = take("--html");
if (dictFiles.length !== 2) { console.error("usage: check-i18n.mjs --dict en --dict es [--html page.html]"); process.exit(2); }

async function load(file) {
  const path = resolve(file), src = readFileSync(path, "utf8");
  if (file.endsWith(".json")) return JSON.parse(src);
  if (/^\s*export\s/m.test(src)) return (await import(pathToFileURL(path))).default;
  const window = {}, ctx = createContext({ window });
  runInContext(src, ctx, { filename: file });
  const bag = Object.values(window)[0] || {};
  const langs = Object.keys(bag);
  if (langs.length !== 1) throw new Error(`${file}: expected one language, found ${langs.join(", ") || "none"}`);
  return bag[langs[0]];
}

const [en, es] = await Promise.all(dictFiles.map(load));
const problems = compareDicts(en, es);

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const keys = [
    ...[...html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/data-i18n-attr="([^"]+)"/g)].flatMap((m) => m[1].split(";").map((p) => p.split(":")[1]?.trim()).filter(Boolean)),
  ];
  const quiet = console.warn; console.warn = () => {};
  for (const k of keys) for (const [name, d] of [["en", en], ["es", es]]) if (t(d, k) === k) problems.push(`${file}: "${k}" missing in ${name}`);
  console.warn = quiet;
}

if (problems.length) {
  console.error(`i18n check failed (${problems.length}):\n  ` + problems.join("\n  "));
  process.exit(1);
}
console.log(`i18n check passed: ${dictFiles.join(" and ")} match${htmlFiles.length ? `, every key in ${htmlFiles.join(", ")} exists` : ""}.`);
