import { execSync } from "child_process";

// ANSI colors for console output
const green = "\x1b[32m";
const reset = "\x1b[0m";

/**
 * Installs the selected npm packages in the project directory.
 * @param {Array} selectedPackages - Array of package objects { name, pkg, dev } selected by the user
 * @param {string} projectDir - Absolute path to the project folder
 */
export async function installPackages(selectedPackages, projectDir) {
  // Separate packages into devDependencies and regular dependencies
  const devDeps = selectedPackages
    .filter((p) => p.dev) // Filter only dev packages
    .map((p) => p.pkg); // Extract the package names

  const deps = selectedPackages
    .filter((p) => !p.dev) // Filter only regular dependencies
    .map((p) => p.pkg); // Extract the package names

  // Install regular dependencies
  if (deps.length > 0) {
    execSync(`npm install ${deps.join(" ")}`, {
      stdio: "inherit", // Show npm output in console
      shell: true, // Run command in shell
      cwd: projectDir, // Run in the project directory
    });
  }

  // Install devDependencies
  if (devDeps.length > 0) {
    execSync(`npm install -D ${devDeps.join(" ")}`, {
      stdio: "inherit",
      shell: true,
      cwd: projectDir,
    });
  }

  console.log(`${green}✅ Selected packages installed!${reset}`);
}
