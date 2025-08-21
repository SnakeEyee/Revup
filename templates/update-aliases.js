#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, "src");
const viteConfigPath = path.join(projectRoot, "vite.config.js");
const jsconfigPath = path.join(projectRoot, "jsconfig.json");

// Get src folder directories
const folders = fs
  .readdirSync(srcDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

// Build dynamic Vite aliases
const viteAliases = {};
folders.forEach((f) => {
  viteAliases[`@${f}`] = `path.resolve(__dirname, "./src/${f}")`;
});

// Build dynamic jsconfig paths
const jsPaths = {};
folders.forEach((f) => {
  jsPaths[`@${f}/*`] = [`./${f}/*`];
});

// Update jsconfig.json
let jsconfig = {
  compilerOptions: { baseUrl: "./src", paths: {} },
  include: ["src/**/*"],
};
if (fs.existsSync(jsconfigPath)) {
  jsconfig = JSON.parse(fs.readFileSync(jsconfigPath, "utf-8"));
}
jsconfig.compilerOptions.paths = jsPaths;
fs.writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2));
console.log("✅ jsconfig.json updated");

// Update vite.config.js safely
let viteConfig = fs.readFileSync(viteConfigPath, "utf-8");

// Detect existing resolve.alias block and replace it
const aliasRegex = /(alias\s*:\s*\{)([\s\S]*?)(\})/m;
if (aliasRegex.test(viteConfig)) {
  const aliasContent = Object.entries(viteAliases)
    .map(([key, value]) => `      "${key}": ${value},`)
    .join("\n");
  viteConfig = viteConfig.replace(aliasRegex, `$1\n${aliasContent}\n$3`);
  fs.writeFileSync(viteConfigPath, viteConfig, "utf-8");
  console.log("✅ vite.config.js aliases updated safely!");
} else {
  console.warn(
    "⚠️ Could not find alias block in vite.config.js, please check manually."
  );
}
