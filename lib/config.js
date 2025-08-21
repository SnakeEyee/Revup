import fs from "fs";
import path from "path";

// ANSI colors for console output
const green = "\x1b[32m";
const blue = "\x1b[34m";
const reset = "\x1b[0m";

/**
 * Generates or updates the vite.config.js file for the project.
 * Sets up plugins, aliases, and optional TailwindCSS & PWA support.
 * @param {Array} selectedPackages - List of packages selected by the user
 * @param {string} projectDir - Absolute path to the project folder
 */
export function updateViteConfig(selectedPackages, projectDir) {
  const viteConfigPath = path.join(projectDir, "vite.config.js");

  // Base imports required for any Vite React project
  const importLines = [
    `import react from "@vitejs/plugin-react";`,
    `import { defineConfig } from "vite";`,
    `import path from "path";`,
    `import { fileURLToPath } from "url";`,
  ];

  // Conditionally add imports based on selected packages
  if (selectedPackages.some((p) => p.name === "TailwindCSS")) {
    importLines.push(`import tailwindcss from "@tailwindcss/vite";`);
  }
  if (selectedPackages.some((p) => p.name === "Vite PWA")) {
    importLines.push(`import { VitePWA } from "vite-plugin-pwa";`);
  }

  // Define path aliases for common folders
  const aliasEntries = [
    `      "@api": path.resolve(__dirname, "./src/api"),`,
    `      "@assets": path.resolve(__dirname, "./src/assets"),`,
    `      "@components": path.resolve(__dirname, "./src/components"),`,
    `      "@ui": path.resolve(__dirname, "./src/components/ui"),`,
    `      "@handlers": path.resolve(__dirname, "./src/handlers"),`,
    `      "@hooks": path.resolve(__dirname, "./src/hooks"),`,
    `      "@pages": path.resolve(__dirname, "./src/pages"),`,
    `      "@routes": path.resolve(__dirname, "./src/routes"),`,
    `      "@services": path.resolve(__dirname, "./src/services"),`,
    `      "@styles": path.resolve(__dirname, "./src/styles"),`,
    `      "@utils": path.resolve(__dirname, "./src/utils"),`,
  ];

  // Add Redux store alias if Redux was selected
  if (selectedPackages.some((p) => p.name.toLowerCase().includes("redux"))) {
    aliasEntries.push(
      `      "@store": path.resolve(__dirname, "./src/store"),`
    );
  }

  // Plugins array for Vite
  const plugins = ["react()"];
  if (selectedPackages.some((p) => p.name === "TailwindCSS"))
    plugins.push("tailwindcss()");
  if (selectedPackages.some((p) => p.name === "Vite PWA"))
    plugins.push(`VitePWA({ registerType: "autoUpdate" })`);

  // Generate the vite.config.js content
  const viteConfigContent = `${importLines.join("\n")}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [${plugins.join(", ")}],
  resolve: {
    alias: {
${aliasEntries.join("\n")}
    }
  }
});
`;

  // Write the file
  fs.writeFileSync(viteConfigPath, viteConfigContent, "utf-8");
  console.log(`${green}✅ Vite config done!${reset}`);

  if (selectedPackages.some((p) => p.name === "Vite PWA")) {
    console.log(`${blue}📱 PWA plugin added!${reset}`);
  }
}

/**
 * Generates jsconfig.json for path aliases
 * @param {Array} selectedPackages - List of packages selected by the user
 * @param {string} projectDir - Absolute path to the project folder
 */
export function createJsConfig(selectedPackages, projectDir) {
  const jsconfigPath = path.join(projectDir, "jsconfig.json");

  // Define paths mapping for VSCode intellisense
  const aliasEntries = [
    ["@api/*", ["./api/*"]],
    ["@assets/*", ["./assets/*"]],
    ["@components/*", ["./components/*"]],
    ["@ui/*", ["./components/ui/*"]],
    ["@handlers/*", ["./handlers/*"]],
    ["@hooks/*", ["./hooks/*"]],
    ["@pages/*", ["./pages/*"]],
    ["@routes/*", ["./routes/*"]],
    ["@services/*", ["./services/*"]],
    ["@styles/*", ["./styles/*"]],
    ["@utils/*", ["./utils/*"]],
  ];

  // Add Redux store path if selected
  if (selectedPackages.some((p) => p.name.toLowerCase().includes("redux"))) {
    aliasEntries.push(["@store/*", ["./store/*"]]);
  }

  const pathsObj = Object.fromEntries(aliasEntries);

  const jsconfig = {
    compilerOptions: {
      baseUrl: "./src",
      paths: pathsObj,
    },
    include: ["src/**/*"],
  };

  // Write jsconfig.json to project
  fs.writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2), "utf-8");
  console.log(`${green}✅ jsconfig.json created!${reset}`);
}
