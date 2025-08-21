#!/usr/bin/env node
// CLI entry point for Create React + Vite project (Revup)

import readline from "readline";
import path from "path";
import { execSync } from "child_process";
import fs from "fs";
import { fileURLToPath } from "url"; // Converts import.meta.url to filesystem paths

// Import custom modules
import { packagesList } from "../lib/packages.js";
import { interactiveMenu } from "../lib/interactive.js";
import { installPackages } from "../lib/installer.js";
import { createFolders } from "../lib/folders.js";
import { setupTailwind } from "../lib/tailwind.js";
import { updateViteConfig, createJsConfig } from "../lib/config.js";

// ANSI colors for console output
const reset = "\x1b[0m";
const green = "\x1b[32m";
const cyan = "\x1b[36m";
const yellow = "\x1b[33m";

// Welcome message
console.log(`👨‍💻 Created by ${cyan}SnakeEye${reset}`);
console.log("---------------------------------\n");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ask the user for the project name
rl.question("Enter your project name: ", async (inputName) => {
  const name = (inputName || "my-pwa").trim(); // Default to "my-pwa" if empty
  const projectDir = path.resolve(process.cwd(), name); // Absolute path to project

  console.log(`⚡ Creating project: ${green}${name}${reset}...`);

  // 1️⃣ Scaffold Vite + React project
  execSync(`npm create vite@latest "${name}" -- --template react`, {
    stdio: "inherit",
    shell: true,
  });

  // 2️⃣ Force install React 18
  execSync(`npm install react@18 react-dom@18`, {
    stdio: "inherit",
    shell: true,
    cwd: projectDir,
  });

  // 3️⃣ Show interactive package selection menu
  const selectedPackages = await interactiveMenu(packagesList);

  // 4️⃣ Run post-scaffold setup
  await installPackages(selectedPackages, projectDir); // Install selected npm packages
  createFolders(selectedPackages, projectDir); // Create structured folders
  setupTailwind(selectedPackages, projectDir); // Configure Tailwind if selected
  updateViteConfig(selectedPackages, projectDir); // Update vite.config.js aliases/plugins
  createJsConfig(selectedPackages, projectDir); // Create jsconfig.json for path aliases

  // 5️⃣ Add alias updater script to project
  const scriptsDir = path.join(projectDir, "scripts"); // Directory for utility scripts
  fs.mkdirSync(scriptsDir, { recursive: true });

  // Copy the template update-aliases.js to the new project
  const templatePath = fileURLToPath(
    new URL("../templates/update-aliases.js", import.meta.url)
  );
  const targetPath = path.join(scriptsDir, "update-aliases.js");
  fs.copyFileSync(templatePath, targetPath);
  fs.chmodSync(targetPath, 0o755); // Make it executable

  // Optional: add npm script to package.json
  const packageJsonPath = path.join(projectDir, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts["update-aliases"] = "node scripts/update-aliases.js";
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log(`📄 scripts/update-aliases.js created!`);
  console.log(`👉 Run it anytime with: ${cyan}npm run update-aliases${reset}`);

  // ✅ Final messages
  console.log(`\n🎉 Project ${yellow}${name}${reset} is ready!`);
  console.log(`👉 ${cyan}cd ${name}${reset}`);
  console.log(`${cyan}👉 npm run dev${reset}`);

  rl.close(); // Close readline interface
});
