import fs from "fs";
import path from "path";

// ANSI colors for console output
const blue = "\x1b[34m";
const reset = "\x1b[0m";

/**
 * Creates the standard folder structure for a React Vite project.
 * Adds optional folders for Redux store and Electron if selected.
 *
 * @param {Array} selectedPackages - List of packages selected by the user
 * @param {string} projectDir - Absolute path to the project folder
 */
export function createFolders(selectedPackages, projectDir) {
  // Base folders to create inside src
  const baseFolders = [
    "api",
    "components/ui",
    "handlers",
    "hooks",
    "middleware",
    "pages",
    "routes",
    "services",
    "styles",
    "utils",
  ];

  // Create each folder recursively
  baseFolders.forEach((folder) => {
    fs.mkdirSync(path.join(projectDir, "src", folder), { recursive: true });
  });

  // If Redux is selected, create a store folder
  if (selectedPackages.some((p) => p.name.includes("Redux"))) {
    fs.mkdirSync(path.join(projectDir, "src", "store"), { recursive: true });
  }

  // If Electron is selected, create an electron folder
  if (selectedPackages.some((p) => p.name === "Electron")) {
    fs.mkdirSync(path.join(projectDir, "src", "electron"), { recursive: true });
  }

  console.log(`${blue}📁 Folder structure created!${reset}`);
}
