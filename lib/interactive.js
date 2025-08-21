import readline from "readline";

/**
 * Displays an interactive menu for selecting packages.
 * User can navigate with ↑ ↓, toggle selection with space, and confirm with enter.
 *
 * @param {Array} packagesList - List of available packages with names and optional dev flag
 * @returns {Promise<Array>} - Resolves with the selected packages
 */
export function interactiveMenu(packagesList) {
  return new Promise((resolve) => {
    // Track which packages are selected
    let selected = new Array(packagesList.length).fill(false);

    // Pointer for the currently highlighted item
    let pointer = 0;

    // Function to render the menu to the console
    const render = () => {
      process.stdout.write("\x1b[2J\x1b[H"); // Clear the screen
      console.log("Use ↑ ↓ arrows, space to select, enter to confirm\n");

      // Print each package with selection state and highlight
      packagesList.forEach((pkg, i) => {
        const isSelected = selected[i] ? "[x]" : "[ ]";
        const color = pointer === i ? "\x1b[36m" : "\x1b[0m"; // Cyan for current pointer
        console.log(`${color}${isSelected} ${pkg.name}\x1b[0m`);
      });
    };

    // Handle keypress events
    const handleKey = (str, key) => {
      if (key.name === "up") {
        pointer = (pointer - 1 + packagesList.length) % packagesList.length; // Wrap around
      } else if (key.name === "down") {
        pointer = (pointer + 1) % packagesList.length; // Wrap around
      } else if (key.name === "space") {
        selected[pointer] = !selected[pointer]; // Toggle selection
      } else if (key.name === "return") {
        // Finish selection and resolve promise
        process.stdin.setRawMode(false);
        process.stdin.removeListener("keypress", handleKey);
        return resolve(packagesList.filter((_, i) => selected[i])); // Return selected packages
      }
      render(); // Update the menu display
    };

    // Enable keypress events in stdin
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true); // Raw mode to capture individual keys
    process.stdin.on("keypress", handleKey); // Listen to keypress
    render(); // Initial render
  });
}
