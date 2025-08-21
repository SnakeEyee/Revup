import fs from "fs";
import path from "path";

const green = "\x1b[32m";
const reset = "\x1b[0m";

/**
 * Sets up TailwindCSS in the newly created project if selected.
 * This includes generating `tailwind.config.js` and ensuring
 * Tailwind directives are present in `src/index.css`.
 *
 * @param {Array} selectedPackages - The packages selected by the user
 * @param {string} projectDir - Absolute path to the project root
 */
export function setupTailwind(selectedPackages, projectDir) {
  // Skip if TailwindCSS was not selected
  if (!selectedPackages.some((p) => p.name === "TailwindCSS")) return;

  // 1️⃣ Create tailwind.config.js if it doesn't exist
  const tailwindConfigPath = path.join(projectDir, "tailwind.config.js");
  if (!fs.existsSync(tailwindConfigPath)) {
    const tw = `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
`;
    fs.writeFileSync(tailwindConfigPath, tw, "utf-8");
  }

  // 2️⃣ Ensure Tailwind directives are in src/index.css
  const cssPath = path.join(projectDir, "src", "index.css");
  if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, "utf-8");

    // Prepend Tailwind import if missing
    if (!/@tailwind\s+base;/.test(css)) {
      fs.writeFileSync(cssPath, `@import "tailwindcss";\n\n${css}`, "utf-8");
    }
  }

  console.log(`${green}✅ Tailwind configured!${reset}`);
}
