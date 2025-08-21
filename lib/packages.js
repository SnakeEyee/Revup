/**
 * List of optional packages users can install via the CLI.
 * Each package can optionally be installed as a devDependency (dev: true)
 *
 * name: Display name in the interactive menu
 * pkg: The npm package(s) to install
 * dev: Whether it should be installed as a dev dependency
 */
export const packagesList = [
  { name: "Axios", pkg: "axios" }, // HTTP client for API requests
  { name: "Electron", pkg: "electron" }, // Electron for building cross-platform desktop apps
  { name: "GSAP", pkg: "gsap" }, // Advanced animations library
  { name: "JS Cookie", pkg: "js-cookie" }, // Simple JavaScript cookie management
  { name: "Motion", pkg: "motion" }, // Animation library for React components
  { name: "React Icons", pkg: "react-icons" }, // Popular icon library for React
  { name: "React Helmet Async", pkg: "react-helmet-async" }, // Manage head tags asynchronously
  { name: "React Router DOM", pkg: "react-router-dom" }, // Routing library for React
  { name: "Redux & Redux Toolkit", pkg: "@reduxjs/toolkit react-redux" }, // State management
  { name: "TailwindCSS", pkg: "tailwindcss @tailwindcss/vite", dev: true }, // Utility-first CSS framework
  { name: "Vite PWA", pkg: "vite-plugin-pwa", dev: true }, // PWA support for Vite projects
];
