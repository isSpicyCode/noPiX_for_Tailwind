const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { promisify } = require("util");

// Promisify fs.writeFile for asynchronous usage
const writeFileAsync = promisify(fs.writeFile);

// 🔧 Project directory
const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, "src");

// 🔧 Utility functions
function writeFileSmart(filePath, content, label) {
  if (fs.existsSync(filePath)) {
    console.log(`🔁 ${label} already exists. Skipped. 😐`);
  } else {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${label} created successfully! 🎉`);
  }
}

// 🔧 Create package.json
const packageJson = {
  name: "nopx-tailwind",
  version: "1.6.0",
  scripts: {
    generate: "node ./src/nopix_script.js",
    watch:
      "npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch",
    nopix: "npm-run-all --parallel generate watch",
    "update-browserslist": "npx update-browserslist-db@latest",
  },
  devDependencies: {
    "@tailwindcss/postcss": "^4.1.3",
    "npm-run-all": "^4.1.5",
    postcss: "^8.5.3",
    tailwindcss: "^4.1.3",
  },
};
writeFileSmart(
  path.join(projectRoot, "package.json"),
  JSON.stringify(packageJson, null, 2),
  "package.json"
);

// 🔧 Create tailwind.config.js
const tailwindConfig = `module.exports = {
  content: ["./**/*.html"], // Scan all HTML files in all directories
  theme: {
    extend: {}
  },
  plugins: []
};`;
writeFileSmart(
  path.join(projectRoot, "tailwind.config.js"),
  tailwindConfig,
  "tailwind.config.js"
);

// 🔧 Create postcss.config.mjs
const postcssConfig = `export default {
  plugins: {
    'postcss-import': {},
    tailwindcss: {}
  }
};`;
writeFileSmart(
  path.join(projectRoot, "postcss.config.mjs"),
  postcssConfig,
  "postcss.config.mjs"
);

// 📁 Create /src directory
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
  console.log("✅ src directory created successfully! 📁🎉");
} else {
  console.log("🔁 src directory already exists. 😐");
}

// 🔧 input.css (in src/)
const inputCss = `
@import "./nopix_theme.css";
@import "./nopix_prefix.css";
@import "tailwindcss";

// Add custom CSS here

 body {
background-image: linear-gradient(158deg, rgba(84, 84, 84, 0.03) 0%, rgba(84, 84, 84, 0.03) 20%,rgba(219, 219, 219, 0.03) 20%, rgba(219, 219, 219, 0.03) 40%,rgba(54, 54, 54, 0.03) 40%, rgba(54, 54, 54, 0.03) 60%,rgba(99, 99, 99, 0.03) 60%, rgba(99, 99, 99, 0.03) 80%,rgba(92, 92, 92, 0.03) 80%, rgba(92, 92, 92, 0.03) 100%),linear-gradient(45deg, rgba(221, 221, 221, 0.02) 0%, rgba(221, 221, 221, 0.02) 14.286%,rgba(8, 8, 8, 0.02) 14.286%, rgba(8, 8, 8, 0.02) 28.572%,rgba(52, 52, 52, 0.02) 28.572%, rgba(52, 52, 52, 0.02) 42.858%,rgba(234, 234, 234, 0.02) 42.858%, rgba(234, 234, 234, 0.02) 57.144%,rgba(81, 81, 81, 0.02) 57.144%, rgba(81, 81, 81, 0.02) 71.42999999999999%,rgba(239, 239, 239, 0.02) 71.43%, rgba(239, 239, 239, 0.02) 85.71600000000001%,rgba(187, 187, 187, 0.02) 85.716%, rgba(187, 187, 187, 0.02) 100.002%),linear-gradient(109deg, rgba(33, 33, 33, 0.03) 0%, rgba(33, 33, 33, 0.03) 12.5%,rgba(147, 147, 147, 0.03) 12.5%, rgba(147, 147, 147, 0.03) 25%,rgba(131, 131, 131, 0.03) 25%, rgba(131, 131, 131, 0.03) 37.5%,rgba(151, 151, 151, 0.03) 37.5%, rgba(151, 151, 151, 0.03) 50%,rgba(211, 211, 211, 0.03) 50%, rgba(211, 211, 211, 0.03) 62.5%,rgba(39, 39, 39, 0.03) 62.5%, rgba(39, 39, 39, 0.03) 75%,rgba(55, 55, 55, 0.03) 75%, rgba(55, 55, 55, 0.03) 87.5%,rgba(82, 82, 82, 0.03) 87.5%, rgba(82, 82, 82, 0.03) 100%),linear-gradient(348deg, rgba(42, 42, 42, 0.02) 0%, rgba(42, 42, 42, 0.02) 20%,rgba(8, 8, 8, 0.02) 20%, rgba(8, 8, 8, 0.02) 40%,rgba(242, 242, 242, 0.02) 40%, rgba(242, 242, 242, 0.02) 60%,rgba(42, 42, 42, 0.02) 60%, rgba(42, 42, 42, 0.02) 80%,rgba(80, 80, 80, 0.02) 80%, rgba(80, 80, 80, 0.02) 100%),linear-gradient(120deg, rgba(106, 106, 106, 0.03) 0%, rgba(106, 106, 106, 0.03) 14.286%,rgba(67, 67, 67, 0.03) 14.286%, rgba(67, 67, 67, 0.03) 28.572%,rgba(134, 134, 134, 0.03) 28.572%, rgba(134, 134, 134, 0.03) 42.858%,rgba(19, 19, 19, 0.03) 42.858%, rgba(19, 19, 19, 0.03) 57.144%,rgba(101, 101, 101, 0.03) 57.144%, rgba(101, 101, 101, 0.03) 71.42999999999999%,rgba(205, 205, 205, 0.03) 71.43%, rgba(205, 205, 205, 0.03) 85.71600000000001%,rgba(53, 53, 53, 0.03) 85.716%, rgba(53, 53, 53, 0.03) 100.002%),linear-gradient(45deg, rgba(214, 214, 214, 0.03) 0%, rgba(214, 214, 214, 0.03) 16.667%,rgba(255, 255, 255, 0.03) 16.667%, rgba(255, 255, 255, 0.03) 33.334%,rgba(250, 250, 250, 0.03) 33.334%, rgba(250, 250, 250, 0.03) 50.001000000000005%,rgba(231, 231, 231, 0.03) 50.001%, rgba(231, 231, 231, 0.03) 66.668%,rgba(241, 241, 241, 0.03) 66.668%, rgba(241, 241, 241, 0.03) 83.33500000000001%,rgba(31, 31, 31, 0.03) 83.335%, rgba(31, 31, 31, 0.03) 100.002%),linear-gradient(59deg, rgba(224, 224, 224, 0.03) 0%, rgba(224, 224, 224, 0.03) 12.5%,rgba(97, 97, 97, 0.03) 12.5%, rgba(97, 97, 97, 0.03) 25%,rgba(143, 143, 143, 0.03) 25%, rgba(143, 143, 143, 0.03) 37.5%,rgba(110, 110, 110, 0.03) 37.5%, rgba(110, 110, 110, 0.03) 50%,rgba(34, 34, 34, 0.03) 50%, rgba(34, 34, 34, 0.03) 62.5%,rgba(155, 155, 155, 0.03) 62.5%, rgba(155, 155, 155, 0.03) 75%,rgba(249, 249, 249, 0.03) 75%, rgba(249, 249, 249, 0.03) 87.5%,rgba(179, 179, 179, 0.03) 87.5%, rgba(179, 179, 179, 0.03) 100%),linear-gradient(241deg, rgba(58, 58, 58, 0.02) 0%, rgba(58, 58, 58, 0.02) 25%,rgba(124, 124, 124, 0.02) 25%, rgba(124, 124, 124, 0.02) 50%,rgba(254, 254, 254, 0.02) 50%, rgba(254, 254, 254, 0.02) 75%,rgba(52, 52, 52, 0.02) 75%, rgba(52, 52, 52, 0.02) 100%),linear-gradient(90deg, rgba(255,255,255, 0),rgba(255,255,255, 0));
 }

 .box {
    box-shadow: 0px 0px 20px 2px rgba(0,0,0,0.4) inset;
 }

`;
writeFileSmart(path.join(srcDir, "input.css"), inputCss, "src/input.css");

// 🔧 welcome.html (in projectRoot/)
const welcomeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="src/output.css" rel="stylesheet">
  <title>NoPiX for Tailwind</title>
</head>
<body class="bg-black text-zinc-100 font-sans min-h-screen overflow-auto flex justify-center items-start mt-5rem">
  <div class="max-w-7xl w-full flex justify-center items-start flex-col md:flex-row ml-2rem mr-2rem gap-4">
    <!-- Main Section -->
    <div class="box flex-1 bg-[#222222c5] p-3rem rounded-2xl border-2 border-solid border-[#363636]">
      <h1 class="text-5xl font-bold mb-4">No<span class="text-[#ffa200]">PiX</span> <span class="font-extralight">for Tailwind</span></h1>
      <h2 class="text-2xl text-zinc-400 mb-8">Use arbitrary values with 1rem = 10px</h2>

      <!-- Getting Started -->
      <h3 class="text-3xl font-semibold mb-4">Getting Started</h3>
      <p class="mb-4">After installation, your NoPiX Tailwind project includes the following subdirectories and files:</p>
      <ul class="list-disc list-outside pl-2rem space-y-3 mb-8">
        <li><strong class="text-[#ffa200]">src/</strong>: Contains configuration and style files.</li>
        <li><strong class="text-[#ffa200]">src/input.css</strong>: Input file for TailwindCSS.</li>
        <li><strong class="text-[#ffa200]">src/output.css</strong>: CSS file generated by TailwindCSS.</li>
        <li><strong class="text-[#ffa200]">src/nopix_theme.css</strong>: File containing theme variables (e.g., --1rem: 10px).</li>
        <li><strong class="text-[#ffa200]">src/nopix_prefix.css</strong>: File containing generated utilities.</li>
        <li><strong class="text-[#ffa200]">src/nopix_script.js</strong>: Script to synchronize HTML classes with CSS files.</li>
        <li><strong class="text-[#ffa200]">src/prefixes.js</strong>: File defining supported prefixes and properties.</li>
      </ul>

      <!-- Changelog -->
      <h3 class="text-3xl font-semibold mb-2rem">Changelog</h3>
      <ul class="list-disc space-y-3 list-outside pl-2rem">
        <li><strong class="text-[#ffa200]">v1.5</strong>: Added support for scanning all HTML files in all directories, improved class parsing for rem-based values (e.g., <code class="text-[#ffa200] bg-stone-800 px-2 py-1 rounded">text-3rem</code>, <code class="text-[#ffa200] bg-stone-800 px-2 py-1 rounded">p-1.7rem</code>).</li>
        <li><strong class="text-[#ffa200]">v1.4</strong>: Added <code class="text-[#ffa200] bg-stone-800 px-2 py-1 rounded">requiresRemAdjustment</code> in prefixes.js to differentiate properties requiring rem conversion, renamed to "NoPiX Tailwind".</li>
        <li><strong class="text-[#ffa200]">v1.3</strong>: Extended prefixes.js with new Tailwind properties supporting arbitrary values (translate-, rotate-, etc.).</li>
        <li><strong class="text-[#ffa200]">v1.2</strong>: Added error handling for file access (e.g., tellcss_prefix.css → nopix_prefix.css) with asynchronous writing.</li>
        <li><strong class="text-[#ffa200]">v1.1</strong>: Fixed a bug in nopix_script.js to avoid redundant variables (e.g., --fontSize-3 and --fontSize-3rem).</li>
        <li><strong class="text-[#ffa200]">v1.0</strong>: Initial version with basic support for rem-based classes (text-, p-, m-, etc.).</li>
      </ul>
    </div>

    <!-- Step-by-Step Guide -->
    <div class="box md:w-1/3 bg-[#222222c5] p-3rem rounded-2xl border-2 border-solid border-[#363636]">
      <h3 class="text-3xl font-semibold mb-1.6rem">Step-by-Step Guide</h3>
      <p class="mb-4">Follow these steps to set up your NoPiX Tailwind project with Node.js:</p>
      <ol class="list-decimal list-inside space-y-6">
        <li>Ensure Node.js is installed on your machine. Download it from <a href="https://nodejs.org/" class="text-[#ffa200] hover:underline">nodejs.org</a> if needed.</li>
        <li>Open a terminal in your project directory (where package.json is located).</li>
        <li>Install dependencies by running: <br><code class="text-[#ffa200] bg-stone-800 px-2 py-1 rounded">npm install</code></li>
        <li>Run the generation and watch script with: <br><code class="text-[#ffa200] bg-stone-800 px-2 py-1 rounded">npm run nopix</code></li>
        <li>Modify your HTML files (e.g., welcome.html or any HTML file in any directory) to add NoPiX Tailwind classes (e.g., <code class="text-[#ffa200] bg-stone-800 px-2 py-1 rounded">text-3rem</code>, <code class="text-[#ffa200] bg-stone-800 px-2 py-1 rounded">p-1.7rem</code>). <strong>Important:</strong> Ensure the <code class="text-[#ffa200] bg-stone-800 px-2 py-1 rounded">&lt;link&gt;</code> tag points to <code class="text-[#ffa200] bg-stone-800 px-2 py-1 rounded">src/output.css</code>. For files at the root (e.g., welcome.html), use <code class="text-[#ffa200] bg-stone-800 px-2 py-1 rounded">&lt;link href="src/output.css" rel="stylesheet"&gt;</code>. For files in subdirectories (e.g., components/index.html), use <code class="text-[#ffa200] bg-stone-800 px-2 py-1 rounded">&lt;link href="../src/output.css" rel="stylesheet"&gt;</code>. With Vite, use <code class="text-[#ffa200] bg-stone-800 px-2 py-1 rounded">&lt;link href="/src/output.css" rel="stylesheet"&gt;</code>. Always adjust the path based on the file's location!</li>
        <li>The <code class="text-[#ffa200] bg-stone-800 px-2 py-1 rounded">nopix_theme.css</code> and <code class="text-[#ffa200] bg-stone-800 px-2 py-1 rounded">nopix_prefix.css</code> files will automatically update on each modification.</li>
        <li>Open your HTML files in a browser (preferably via a server like Vite) to see the results.</li>
      </ol>
    </div>
  </div>
</body>
</html>`;
writeFileSmart(
  path.join(projectRoot, "welcome.html"),
  welcomeHtml,
  "welcome.html"
);

// 🔧 Create prefixes.js
const prefixesJs = `const properties = [
  // Typography
  { prefix: 'text-', cssProperty: 'font-size', variablePrefix: 'fontSize', requiresRemAdjustment: true },
  { prefix: 'font-', cssProperty: 'font-weight', variablePrefix: 'fontWeight', requiresRemAdjustment: false },
  { prefix: 'leading-', cssProperty: 'line-height', variablePrefix: 'lineHeight', requiresRemAdjustment: true },
  { prefix: 'tracking-', cssProperty: 'letter-spacing', variablePrefix: 'letterSpacing', requiresRemAdjustment: true },
  { prefix: 'decoration-', cssProperty: 'text-decoration-thickness', variablePrefix: 'textDecorationThickness', requiresRemAdjustment: true },
  { prefix: 'underline-offset-', cssProperty: 'text-underline-offset', variablePrefix: 'textUnderlineOffset', requiresRemAdjustment: true },
  { prefix: 'text-shadow-', cssProperty: 'text-shadow', variablePrefix: 'textShadow', requiresRemAdjustment: true },
  { prefix: 'text-edge-', cssProperty: 'text-edge', variablePrefix: 'textEdge', requiresRemAdjustment: false },
  { prefix: 'text-indent-edge-', cssProperty: 'text-indent-edge', variablePrefix: 'textIndentEdge', requiresRemAdjustment: true },
  { prefix: 'text-justify-', cssProperty: 'text-justify', variablePrefix: 'textJustify', requiresRemAdjustment: false },
  { prefix: 'text-align-last-', cssProperty: 'text-align-last', variablePrefix: 'textAlignLast', requiresRemAdjustment: false },
  { prefix: 'text-emphasis-position-', cssProperty: 'text-emphasis-position', variablePrefix: 'textEmphasisPosition', requiresRemAdjustment: false },
  { prefix: 'text-overflow-', cssProperty: 'text-overflow', variablePrefix: 'textOverflow', requiresRemAdjustment: false },
  { prefix: 'text-size-adjust-', cssProperty: 'text-size-adjust', variablePrefix: 'textSizeAdjust', requiresRemAdjustment: false },
  { prefix: 'text-wrap-mode-', cssProperty: 'text-wrap-mode', variablePrefix: 'textWrapMode', requiresRemAdjustment: false },
  { prefix: 'text-spacing-', cssProperty: 'text-spacing', variablePrefix: 'textSpacing', requiresRemAdjustment: false },
  { prefix: 'font-variation-', cssProperty: 'font-variation-settings', variablePrefix: 'fontVariationSettings', requiresRemAdjustment: false },
  { prefix: 'font-optical-sizing-', cssProperty: 'font-optical-sizing', variablePrefix: 'fontOpticalSizing', requiresRemAdjustment: false },
  { prefix: 'font-feature-', cssProperty: 'font-feature-settings', variablePrefix: 'fontFeatureSettings', requiresRemAdjustment: false },
  { prefix: 'font-kerning-', cssProperty: 'font-kerning', variablePrefix: 'fontKerning', requiresRemAdjustment: false },
  { prefix: 'font-palette-', cssProperty: 'font-palette', variablePrefix: 'fontPalette', requiresRemAdjustment: false },
  { prefix: 'font-stretch-', cssProperty: 'font-stretch', variablePrefix: 'fontStretch', requiresRemAdjustment: false },
  { prefix: 'font-synthesis-', cssProperty: 'font-synthesis', variablePrefix: 'fontSynthesis', requiresRemAdjustment: false },
  { prefix: 'hyphenate-character-', cssProperty: 'hyphenate-character', variablePrefix: 'hyphenateCharacter', requiresRemAdjustment: false },
  { prefix: 'hyphenate-limit-chars-', cssProperty: 'hyphenate-limit-chars', variablePrefix: 'hyphenateLimitChars', requiresRemAdjustment: false },
  { prefix: 'initial-letter-', cssProperty: 'initial-letter', variablePrefix: 'initialLetter', requiresRemAdjustment: false },

  // Spacing and Sizing
  { prefix: 'p-', cssProperty: 'padding', variablePrefix: 'padding', requiresRemAdjustment: true },
  { prefix: 'pt-', cssProperty: 'padding-top', variablePrefix: 'paddingTop', requiresRemAdjustment: true },
  { prefix: 'pb-', cssProperty: 'padding-bottom', variablePrefix: 'paddingBottom', requiresRemAdjustment: true },
  { prefix: 'pl-', cssProperty: 'padding-left', variablePrefix: 'paddingLeft', requiresRemAdjustment: true },
  { prefix: 'pr-', cssProperty: 'padding-right', variablePrefix: 'paddingRight', requiresRemAdjustment: true },
  { prefix: 'm-', cssProperty: 'margin', variablePrefix: 'margin', requiresRemAdjustment: true },
  { prefix: 'mt-', cssProperty: 'margin-top', variablePrefix: 'marginTop', requiresRemAdjustment: true },
  { prefix: 'mb-', cssProperty: 'margin-bottom', variablePrefix: 'marginBottom', requiresRemAdjustment: true },
  { prefix: 'ml-', cssProperty: 'margin-left', variablePrefix: 'marginLeft', requiresRemAdjustment: true },
  { prefix: 'mr-', cssProperty: 'margin-right', variablePrefix: 'marginRight', requiresRemAdjustment: true },
  { prefix: 'w-', cssProperty: 'width', variablePrefix: 'width', requiresRemAdjustment: true },
  { prefix: 'h-', cssProperty: 'height', variablePrefix: 'height', requiresRemAdjustment: true },
  { prefix: 'min-w-', cssProperty: 'min-width', variablePrefix: 'minWidth', requiresRemAdjustment: true },
  { prefix: 'max-w-', cssProperty: 'max-width', variablePrefix: 'maxWidth', requiresRemAdjustment: true },
  { prefix: 'min-h-', cssProperty: 'min-height', variablePrefix: 'minHeight', requiresRemAdjustment: true },
  { prefix: 'max-h-', cssProperty: 'max-height', variablePrefix: 'maxHeight', requiresRemAdjustment: true },
  { prefix: 'gap-', cssProperty: 'gap', variablePrefix: 'gap', requiresRemAdjustment: true },
  { prefix: 'col-gap-', cssProperty: 'column-gap', variablePrefix: 'columnGap', requiresRemAdjustment: true },
  { prefix: 'row-gap-', cssProperty: 'row-gap', variablePrefix: 'rowGap', requiresRemAdjustment: true },
  { prefix: 'size-', cssProperty: 'size', variablePrefix: 'size', requiresRemAdjustment: true },

  // Borders and Shadows
  { prefix: 'border-', cssProperty: 'border-width', variablePrefix: 'borderWidth', requiresRemAdjustment: true },
  { prefix: 'rounded-', cssProperty: 'border-radius', variablePrefix: 'borderRadius', requiresRemAdjustment: true },
  { prefix: 'shadow-', cssProperty: 'box-shadow', variablePrefix: 'boxShadow', requiresRemAdjustment: true },
  { prefix: 'drop-shadow-', cssProperty: 'drop-shadow', variablePrefix: 'dropShadow', requiresRemAdjustment: true },
  { prefix: 'outline-', cssProperty: 'outline-width', variablePrefix: 'outlineWidth', requiresRemAdjustment: true },
  { prefix: 'ring-', cssProperty: 'ring-width', variablePrefix: 'ringWidth', requiresRemAdjustment: true },
  { prefix: 'ring-offset-', cssProperty: 'ring-offset-width', variablePrefix: 'ringOffsetWidth', requiresRemAdjustment: true },
  { prefix: 'border-image-width-', cssProperty: 'border-image-width', variablePrefix: 'borderImageWidth', requiresRemAdjustment: true },
  { prefix: 'border-image-outset-', cssProperty: 'border-image-outset', variablePrefix: 'borderImageOutset', requiresRemAdjustment: true },
  { prefix: 'border-image-slice-', cssProperty: 'border-image-slice', variablePrefix: 'borderImageSlice', requiresRemAdjustment: false },
  { prefix: 'border-spacing-', cssProperty: 'border-spacing', variablePrefix: 'borderSpacing', requiresRemAdjustment: true },
  { prefix: 'column-rule-', cssProperty: 'column-rule-width', variablePrefix: 'columnRuleWidth', requiresRemAdjustment: true },

  // Layout and Positioning
  { prefix: 'top-', cssProperty: 'top', variablePrefix: 'top', requiresRemAdjustment: true },
  { prefix: 'right-', cssProperty: 'right', variablePrefix: 'right', requiresRemAdjustment: true },
  { prefix: 'bottom-', cssProperty: 'bottom', variablePrefix: 'bottom', requiresRemAdjustment: true },
  { prefix: 'left-', cssProperty: 'left', variablePrefix: 'left', requiresRemAdjustment: true },
  { prefix: 'inset-', cssProperty: 'inset', variablePrefix: 'inset', requiresRemAdjustment: true },
  { prefix: 'translate-x-', cssProperty: 'translate-x', variablePrefix: 'translateX', requiresRemAdjustment: true },
  { prefix: 'translate-y-', cssProperty: 'translate-y', variablePrefix: 'translateY', requiresRemAdjustment: true },
  { prefix: 'rotate-', cssProperty: 'rotate', variablePrefix: 'rotate', requiresRemAdjustment: false },
  { prefix: 'scale-', cssProperty: 'scale', variablePrefix: 'scale', requiresRemAdjustment: false },
  { prefix: 'skew-x-', cssProperty: 'skew-x', variablePrefix: 'skewX', requiresRemAdjustment: false },
  { prefix: 'skew-y-', cssProperty: 'skew-y', variablePrefix: 'skewY', requiresRemAdjustment: false },
  { prefix: 'transform-origin-', cssProperty: 'transform-origin', variablePrefix: 'transformOrigin', requiresRemAdjustment: true },
  { prefix: 'perspective-', cssProperty: 'perspective', variablePrefix: 'perspective', requiresRemAdjustment: true },
  { prefix: 'perspective-origin-', cssProperty: 'perspective-origin', variablePrefix: 'perspectiveOrigin', requiresRemAdjustment: true },

  // Grid and Flexbox
  { prefix: 'grid-cols-', cssProperty: 'grid-template-columns', variablePrefix: 'gridTemplateColumns', requiresRemAdjustment: true },
  { prefix: 'grid-rows-', cssProperty: 'grid-template-rows', variablePrefix: 'gridTemplateRows', requiresRemAdjustment: true },
  { prefix: 'row-start-', cssProperty: 'grid-row-start', variablePrefix: 'gridRowStart', requiresRemAdjustment: false },
  { prefix: 'row-end-', cssProperty: 'grid-row-end', variablePrefix: 'gridRowEnd', requiresRemAdjustment: false },
  { prefix: 'col-start-', cssProperty: 'grid-column-start', variablePrefix: 'gridColumnStart', requiresRemAdjustment: false },
  { prefix: 'col-end-', cssProperty: 'grid-column-end', variablePrefix: 'gridColumnEnd', requiresRemAdjustment: false },
  { prefix: 'flex-', cssProperty: 'flex', variablePrefix: 'flex', requiresRemAdjustment: false },
  { prefix: 'basis-', cssProperty: 'flex-basis', variablePrefix: 'flexBasis', requiresRemAdjustment: true },

  // Background and Images
  { prefix: 'bg-', cssProperty: 'background', variablePrefix: 'background', requiresRemAdjustment: false },
  { prefix: 'bg-pos-x-', cssProperty: 'background-position-x', variablePrefix: 'backgroundPositionX', requiresRemAdjustment: true },
  { prefix: 'bg-pos-y-', cssProperty: 'background-position-y', variablePrefix: 'backgroundPositionY', requiresRemAdjustment: true },
  { prefix: 'bg-repeat-', cssProperty: 'background-repeat', variablePrefix: 'backgroundRepeat', requiresRemAdjustment: false },
  { prefix: 'bg-clip-', cssProperty: 'background-clip', variablePrefix: 'backgroundClip', requiresRemAdjustment: false },
  { prefix: 'mask-size-', cssProperty: 'mask-size', variablePrefix: 'maskSize', requiresRemAdjustment: true },
  { prefix: 'mask-position-', cssProperty: 'mask-position', variablePrefix: 'maskPosition', requiresRemAdjustment: true },
  { prefix: 'mask-border-width-', cssProperty: 'mask-border-width', variablePrefix: 'maskBorderWidth', requiresRemAdjustment: true },
  { prefix: 'mask-border-outset-', cssProperty: 'mask-border-outset', variablePrefix: 'maskBorderOutset', requiresRemAdjustment: true },
  { prefix: 'mask-border-slice-', cssProperty: 'mask-border-slice', variablePrefix: 'maskBorderSlice', requiresRemAdjustment: false },

  // Animation and Transition
  { prefix: 'transition-', cssProperty: 'transition', variablePrefix: 'transition', requiresRemAdjustment: false },
  { prefix: 'animation-', cssProperty: 'animation', variablePrefix: 'animation', requiresRemAdjustment: false },
  { prefix: 'animation-duration-', cssProperty: 'animation-duration', variablePrefix: 'animationDuration', requiresRemAdjustment: false },
  { prefix: 'animation-delay-', cssProperty: 'animation-delay', variablePrefix: 'animationDelay', requiresRemAdjustment: false },
  { prefix: 'animation-timing-', cssProperty: 'animation-timing-function', variablePrefix: 'animationTimingFunction', requiresRemAdjustment: false },

  // Scrolling
  { prefix: 'scroll-m-', cssProperty: 'scroll-margin', variablePrefix: 'scrollMargin', requiresRemAdjustment: true },
  { prefix: 'scroll-mt-', cssProperty: 'scroll-margin-top', variablePrefix: 'scrollMarginTop', requiresRemAdjustment: true },
  { prefix: 'scroll-mb-', cssProperty: 'scroll-margin-bottom', variablePrefix: 'scrollMarginBottom', requiresRemAdjustment: true },
  { prefix: 'scroll-ml-', cssProperty: 'scroll-margin-left', variablePrefix: 'scrollMarginLeft', requiresRemAdjustment: true },
  { prefix: 'scroll-mr-', cssProperty: 'scroll-margin-right', variablePrefix: 'scrollMarginRight', requiresRemAdjustment: true },
  { prefix: 'scroll-p-', cssProperty: 'scroll-padding', variablePrefix: 'scrollPadding', requiresRemAdjustment: true },
  { prefix: 'scroll-pt-', cssProperty: 'scroll-padding-top', variablePrefix: 'scrollPaddingTop', requiresRemAdjustment: true },
  { prefix: 'scroll-pb-', cssProperty: 'scroll-padding-bottom', variablePrefix: 'scrollPaddingBottom', requiresRemAdjustment: true },
  { prefix: 'scroll-pl-', cssProperty: 'scroll-padding-left', variablePrefix: 'scrollPaddingLeft', requiresRemAdjustment: true },
  { prefix: 'scroll-pr-', cssProperty: 'scroll-padding-right', variablePrefix: 'scrollPaddingRight', requiresRemAdjustment: true },
  { prefix: 'scroll-snap-m-', cssProperty: 'scroll-snap-margin', variablePrefix: 'scrollSnapMargin', requiresRemAdjustment: true },
  { prefix: 'scroll-snap-align-', cssProperty: 'scroll-snap-align', variablePrefix: 'scrollSnapAlign', requiresRemAdjustment: false },
  { prefix: 'scroll-snap-stop-', cssProperty: 'scroll-snap-stop', variablePrefix: 'scrollSnapStop', requiresRemAdjustment: false },
  { prefix: 'scroll-snap-type-', cssProperty: 'scroll-snap-type', variablePrefix: 'scrollSnapType', requiresRemAdjustment: false },
  { prefix: 'scroll-behavior-', cssProperty: 'scroll-behavior', variablePrefix: 'scrollBehavior', requiresRemAdjustment: false },
  { prefix: 'scroll-timeline-', cssProperty: 'scroll-timeline', variablePrefix: 'scrollTimeline', requiresRemAdjustment: false },
  { prefix: 'scrollbar-width-', cssProperty: 'scrollbar-width', variablePrefix: 'scrollbarWidth', requiresRemAdjustment: true },
  { prefix: 'scrollbar-gutter-', cssProperty: 'scrollbar-gutter', variablePrefix: 'scrollbarGutter', requiresRemAdjustment: true },

  // Miscellaneous
  { prefix: 'accent-', cssProperty: 'accent-color', variablePrefix: 'accentColor', requiresRemAdjustment: false },
  { prefix: 'align-', cssProperty: 'vertical-align', variablePrefix: 'verticalAlign', requiresRemAdjustment: true },
  { prefix: 'appearance-', cssProperty: 'appearance', variablePrefix: 'appearance', requiresRemAdjustment: false },
  { prefix: 'aspect-', cssProperty: 'aspect-ratio', variablePrefix: 'aspectRatio', requiresRemAdjustment: false },
  { prefix: 'backdrop-', cssProperty: 'backdrop-filter', variablePrefix: 'backdropFilter', requiresRemAdjustment: true },
  { prefix: 'baseline-shift-', cssProperty: 'baseline-shift', variablePrefix: 'baselineShift', requiresRemAdjustment: true },
  { prefix: 'blur-', cssProperty: 'blur', variablePrefix: 'blur', requiresRemAdjustment: true },
  { prefix: 'caption-side-', cssProperty: 'caption-side', variablePrefix: 'captionSide', requiresRemAdjustment: false },
  { prefix: 'clear-', cssProperty: 'clear', variablePrefix: 'clear', requiresRemAdjustment: false },
  { prefix: 'clip-path-', cssProperty: 'clip-path', variablePrefix: 'clipPath', requiresRemAdjustment: true },
  { prefix: 'columns-', cssProperty: 'columns', variablePrefix: 'columns', requiresRemAdjustment: true },
  { prefix: 'container-type-', cssProperty: 'container-type', variablePrefix: 'containerType', requiresRemAdjustment: false },
  { prefix: 'container-name-', cssProperty: 'container-name', variablePrefix: 'containerName', requiresRemAdjustment: false },
  { prefix: 'content-', cssProperty: 'content', variablePrefix: 'content', requiresRemAdjustment: false },
  { prefix: 'counter-increment-', cssProperty: 'counter-increment', variablePrefix: 'counterIncrement', requiresRemAdjustment: false }
]
  module.exports = properties;`;

writeFileSmart(path.join(srcDir, "prefixes.js"), prefixesJs, "src/prefixes.js");

// 🔧 Create nopix_theme.css
const nopixThemeCss = `:root {
  font-size: 16px; /* Base font size for Tailwind, 1rem = 16px */
  --1rem: 10px; /* Scale for NoPiX Tailwind */
}
`;
writeFileSmart(
  path.join(srcDir, "nopix_theme.css"),
  nopixThemeCss,
  "src/nopix_theme.css"
);

// 🔧 Create nopix_prefix.css
const nopixPrefixCss = `/* Utilities generated by nopix_script.js */`;
writeFileSmart(
  path.join(srcDir, "nopix_prefix.css"),
  nopixPrefixCss,
  "src/nopix_prefix.css"
);

// 🔧 Create nopix_script.js
const nopixScriptJs = `const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Promisify fs.writeFile for asynchronous usage
const writeFileAsync = promisify(fs.writeFile);

// Project directories
const projectDir = path.resolve(__dirname, '..');
const srcDir = path.join(projectDir, 'src');
const themeFilePath = path.join(srcDir, 'nopix_theme.css');
const prefixFilePath = path.join(srcDir, 'nopix_prefix.css');

// Load properties from prefixes.js
let properties;
try {
  properties = require('./prefixes.js');
} catch (err) {
  console.error(\`❌ Error loading prefixes.js: \${err.message}\`);
  process.exit(1);
}

// Directories to exclude during search
const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build'];

// Cache to store last modification times
const fileTimestamps = new Map();
// Object to manage debounce events
const debounceTimeouts = new Map();

// Function to find HTML files in the entire project
function findHtmlFiles() {
  const htmlFiles = [];
  function scanDir(dir) {
    try {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory() && !EXCLUDED_DIRS.some(excluded => fullPath.includes(excluded))) {
          scanDir(fullPath);
        } else if (file.name.endsWith('.html')) {
          htmlFiles.push(fullPath);
        }
      }
    } catch (err) {
      console.error(\`❌ Error reading directory \${dir}: \${err.message}\`);
    }
  }
  scanDir(projectDir);
  return htmlFiles;
}

// Parse classes in HTML content
function parseHtmlClasses(htmlContent) {
  const classRegex = /class="([^"]*)"/g;
  const classes = [];
  let match;
  while ((match = classRegex.exec(htmlContent)) !== null) {
    classes.push(...match[1].trim().split(/\\s+/));
  }
  return classes.filter(className => {
    return properties.some(({ prefix }) => {
      // Regex for classes like p-1.7rem, text-0.5rem, etc.
      const remRegex = new RegExp(\`^\${prefix}(\\\\d*\\\\.?\\\\d+rem)$\`);
      return remRegex.test(className);
    });
  });
}

// Extract classes by property
function extractRemClasses(htmlContent) {
  const classesByProperty = {};
  properties.forEach(({ prefix }) => {
    // Regex to extract values like 1.7rem, 0.5rem
    const remRegex = new RegExp(\`\${prefix}(\\\\d*\\\\.?\\\\d+rem)\`, 'g');
    const matches = [...htmlContent.matchAll(remRegex)].map(match => match[1]);
    classesByProperty[prefix] = [...new Set(matches)];
  });
  return classesByProperty;
}

// Extract existing variables from CSS file
function extractExistingVariables(cssContent) {
  const themeRegex = /@theme\\s*{([^}]*)}/;
  const match = cssContent.match(themeRegex);
  if (!match) return {};
  const variables = {};
  const lines = match[1].split('\\n').map(line => line.trim()).filter(line => line);
  lines.forEach(line => {
    const [key, value] = line.split(':').map(part => part.trim().replace(';', ''));
    variables[key] = value;
  });
  return variables;
}

// Identify used variables
function getUsedVariables(classesByProperty) {
  const usedVariables = new Set();
  properties.forEach(({ prefix, variablePrefix }) => {
    const sizes = classesByProperty[prefix] || [];
    sizes.forEach(size => {
      const key = \`--\${variablePrefix}-\${size.replace('.', '-').replace('rem', '')}rem\`;
      usedVariables.add(key);
    });
  });
  return usedVariables;
}

// Clean unused variables
function cleanUnusedVariables(existingVariables, usedVariables) {
  const cleanedVariables = { '--1rem': '10px' };
  Object.keys(existingVariables).forEach(key => {
    if (key === '--1rem' || usedVariables.has(key)) {
      cleanedVariables[key] = existingVariables[key];
    }
  });
  return cleanedVariables;
}

// Generate theme and utilities
function generateThemeAndUtilities(classesByProperty, existingVariables) {
  const usedVariables = getUsedVariables(classesByProperty);
  const variables = cleanUnusedVariables(existingVariables, usedVariables);
  const utilities = [];

  properties.forEach(({ prefix, cssProperty, variablePrefix, requiresRemAdjustment }) => {
    const sizes = classesByProperty[prefix] || [];
    sizes.forEach(size => {
      const key = \`--\${variablePrefix}-\${size.replace('.', '-').replace('rem', '')}rem\`;
      let cssValue;
      if (requiresRemAdjustment && size.endsWith('rem')) {
        const valueInPx = parseFloat(size) * 10;
        cssValue = \`\${valueInPx}px\`;
      } else {
        cssValue = size;
      }
      if (cssProperty === 'box-shadow' && requiresRemAdjustment) {
        cssValue = \`0 0 \${parseFloat(size) * 10}px rgba(0, 0, 0, 0.1)\`;
      }
      variables[key] = cssValue;
      const utilityName = prefix + size;
      utilities.push(\`@utility \${utilityName} {\\n  \${cssProperty}: var(\${key});\\n}\`);
    });
  });

  const cssVariables = Object.entries(variables)
    .map(([key, value]) => \`  \${key}: \${value};\`)
    .sort() // Sort for consistency
    .join('\\n');

  return {
    themeBlock: \`:root {\\n  font-size: 16px;\\n  --1rem: 10px;\\n}\\n\\n@theme {\\n\${cssVariables}\\n}\`,
    utilitiesBlock: utilities.sort().join('\\n\\n') // Sort for consistency
  };
}

// Main function to update CSS files
async function updateCssFiles(changedFile = null) {
  try {
    const utilityRegex = new RegExp(
      \`@utility\\\\s+(\${properties.map(p => p.prefix).join('|')})[^\\\\s{]+\\\\s*{[^}]*}\\\\s*\`,
      'g'
    );

    console.log(changedFile ? 
      \`🔍 Change detected in \${path.relative(projectDir, changedFile)}... ⏳\` : 
      \`🔍 Initial HTML files analysis... ⏳\`
    );

    const htmlFiles = findHtmlFiles();
    if (htmlFiles.length === 0) {
      console.log('⚠️ No HTML files found. 😐');
      return;
    }
    console.log('📄 HTML files found:', htmlFiles.map(f => path.relative(projectDir, f)));

    let allValidClasses = [];
    let allClassesByProperty = {};
    for (const htmlFile of htmlFiles) {
      if (!fs.existsSync(htmlFile)) {
        console.log(\`❌ File \${path.relative(projectDir, htmlFile)} not found. 😞\`);
        continue;
      }
      const htmlContent = fs.readFileSync(htmlFile, 'utf8');
      const validClasses = parseHtmlClasses(htmlContent);
      allValidClasses.push(...validClasses);
      const classesByProperty = extractRemClasses(htmlContent);
      Object.keys(classesByProperty).forEach(prefix => {
        allClassesByProperty[prefix] = [
          ...(allClassesByProperty[prefix] || []),
          ...classesByProperty[prefix]
        ];
      });
    }

    allValidClasses = [...new Set(allValidClasses)];
    if (allValidClasses.length === 0) {
      console.log('⚠️ No valid classes found in class="...". 😐');
      return;
    }
    console.log('✅ Valid classes detected:', allValidClasses);

    const existingVariables = extractExistingVariables(
      fs.existsSync(themeFilePath) ? fs.readFileSync(themeFilePath, 'utf8') : ''
    );

    const { themeBlock, utilitiesBlock } = generateThemeAndUtilities(allClassesByProperty, existingVariables);

    // Write theme file
    await writeFileAsync(themeFilePath, themeBlock, 'utf8');
    console.log('✅ nopix_theme.css updated successfully! 📝🎉');

    // Write prefix file
    let prefixContent = fs.existsSync(prefixFilePath) ? fs.readFileSync(prefixFilePath, 'utf8') : '';
    prefixContent = prefixContent.replace(utilityRegex, '');
    const newPrefixContent = utilitiesBlock ? prefixContent.trim() + '\\n\\n' + utilitiesBlock : prefixContent;
    await writeFileAsync(prefixFilePath, newPrefixContent, 'utf8');
    console.log('✅ nopix_prefix.css updated successfully! 📝🎉');
  } catch (err) {
    console.error('❌ Error updating CSS files: 😞', err.message);
  }
}

// Custom watch function
function watchHtmlFiles() {
  console.log('🚀 HTML files watch started... 🎉');

  // Function to watch an individual file
  function watchFile(filePath) {
    try {
      const watcher = fs.watch(filePath, { persistent: true }, (eventType, filename) => {
        if (eventType !== 'change' || !filename) return;

        // Debounce: wait 500ms to avoid multiple events
        if (debounceTimeouts.has(filePath)) {
          clearTimeout(debounceTimeouts.get(filePath));
        }
        debounceTimeouts.set(filePath, setTimeout(async () => {
          try {
            const stats = fs.statSync(filePath);
            const mtime = stats.mtimeMs;
            const lastMtime = fileTimestamps.get(filePath) || 0;

            if (mtime > lastMtime) {
              fileTimestamps.set(filePath, mtime);
              await updateCssFiles(filePath);
            }
          } catch (err) {
            console.error(\`❌ Error checking \${path.relative(projectDir, filePath)}: \${err.message}\`);
          }
          debounceTimeouts.delete(filePath);
        }, 500));
      });

      watcher.on('error', (err) => {
        console.error(\`❌ Watch error on \${path.relative(projectDir, filePath)}: \${err.message}\`);
      });
    } catch (err) {
      console.error(\`❌ Unable to watch \${path.relative(projectDir, filePath)}: \${err.message}\`);
    }
  }

  // Initial check and watch existing files
  const initialFiles = findHtmlFiles();
  initialFiles.forEach(file => {
    try {
      const stats = fs.statSync(file);
      fileTimestamps.set(file, stats.mtimeMs);
      watchFile(file);
    } catch (err) {
      console.error(\`❌ Error initializing \${path.relative(projectDir, file)}: \${err.message}\`);
    }
  });

  // Periodic check for new files (every 10 seconds)
  setInterval(() => {
    const currentFiles = findHtmlFiles();
    const newFiles = currentFiles.filter(file => !fileTimestamps.has(file));
    newFiles.forEach(file => {
      try {
        const stats = fs.statSync(file);
        fileTimestamps.set(file, stats.mtimeMs);
        console.log(\`📄 New file detected: \${path.relative(projectDir, file)}\`);
        watchFile(file);
        updateCssFiles(file);
      } catch (err) {
        console.error(\`❌ Error adding \${path.relative(projectDir, file)}: \${err.message}\`);
      }
    });
  }, 10000);
}

delete require.cache[require.resolve('./prefixes.js')];
properties = require('./prefixes.js');

// Initial execution and start watching
updateCssFiles().then(() => {
  watchHtmlFiles();
});
`;

writeFileSmart(
  path.join(srcDir, "nopix_script.js"),
  nopixScriptJs,
  "src/nopix_script.js"
);

// 📦 Install dependencies
try {
  console.log("📦 Installing Tailwind CSS, PostCSS, and npm-run-all... ⏳");
  execSync(
    "npm install --save-dev @tailwindcss/postcss tailwindcss postcss npm-run-all",
    { stdio: "inherit" }
  );
  console.log("✅ Dependencies installed successfully! 🎉");
} catch (err) {
  console.error("❌ Error during dependency installation: 😞", err.message);
  process.exit(1);
}

console.log("🚀 Setup complete! Ready to code with NoPiX Tailwind! 🎉");
console.log("📋 Next steps:");
console.log("1. Update Browserslist:");
console.log("   npm run update-browserslist");
console.log("2. Run:");
console.log("   npm run nopix 🚀");
console.log('   (This will run "generate" and "watch" in parallel)');
