const fs = require('fs');
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
  console.error(`❌ Error loading prefixes.js: ${err.message}`);
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
      console.error(`❌ Error reading directory ${dir}: ${err.message}`);
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
    classes.push(...match[1].trim().split(/\s+/));
  }
  return classes.filter(className => {
    return properties.some(({ prefix }) => {
      // Regex for classes like p-1.7rem, text-0.5rem, etc.
      const remRegex = new RegExp(`^${prefix}(\\d*\\.?\\d+rem)$`);
      return remRegex.test(className);
    });
  });
}

// Extract classes by property
function extractRemClasses(htmlContent) {
  const classesByProperty = {};
  properties.forEach(({ prefix }) => {
    // Regex to extract values like 1.7rem, 0.5rem
    const remRegex = new RegExp(`${prefix}(\\d*\\.?\\d+rem)`, 'g');
    const matches = [...htmlContent.matchAll(remRegex)].map(match => match[1]);
    classesByProperty[prefix] = [...new Set(matches)];
  });
  return classesByProperty;
}

// Extract existing variables from CSS file
function extractExistingVariables(cssContent) {
  const themeRegex = /@theme\s*{([^}]*)}/;
  const match = cssContent.match(themeRegex);
  if (!match) return {};
  const variables = {};
  const lines = match[1].split('\n').map(line => line.trim()).filter(line => line);
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
      const key = `--${variablePrefix}-${size.replace('.', '-').replace('rem', '')}rem`;
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
      const key = `--${variablePrefix}-${size.replace('.', '-').replace('rem', '')}rem`;
      let cssValue;
      if (requiresRemAdjustment && size.endsWith('rem')) {
        const valueInPx = parseFloat(size) * 10;
        cssValue = `${valueInPx}px`;
      } else {
        cssValue = size;
      }
      if (cssProperty === 'box-shadow' && requiresRemAdjustment) {
        cssValue = `0 0 ${parseFloat(size) * 10}px rgba(0, 0, 0, 0.1)`;
      }
      variables[key] = cssValue;
      const utilityName = prefix + size;
      utilities.push(`@utility ${utilityName} {\n  ${cssProperty}: var(${key});\n}`);
    });
  });

  const cssVariables = Object.entries(variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .sort() // Sort for consistency
    .join('\n');

  return {
    themeBlock: `:root {\n  font-size: 16px;\n  --1rem: 10px;\n}\n\n@theme {\n${cssVariables}\n}`,
    utilitiesBlock: utilities.sort().join('\n\n') // Sort for consistency
  };
}

// Main function to update CSS files
async function updateCssFiles(changedFile = null) {
  try {
    const utilityRegex = new RegExp(
      `@utility\\s+(${properties.map(p => p.prefix).join('|')})[^\\s{]+\\s*{[^}]*}\\s*`,
      'g'
    );

    console.log(changedFile ? 
      `🔍 Change detected in ${path.relative(projectDir, changedFile)}... ⏳` : 
      `🔍 Initial HTML files analysis... ⏳`
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
        console.log(`❌ File ${path.relative(projectDir, htmlFile)} not found. 😞`);
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
    const newPrefixContent = utilitiesBlock ? prefixContent.trim() + '\n\n' + utilitiesBlock : prefixContent;
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
            console.error(`❌ Error checking ${path.relative(projectDir, filePath)}: ${err.message}`);
          }
          debounceTimeouts.delete(filePath);
        }, 500));
      });

      watcher.on('error', (err) => {
        console.error(`❌ Watch error on ${path.relative(projectDir, filePath)}: ${err.message}`);
      });
    } catch (err) {
      console.error(`❌ Unable to watch ${path.relative(projectDir, filePath)}: ${err.message}`);
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
      console.error(`❌ Error initializing ${path.relative(projectDir, file)}: ${err.message}`);
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
        console.log(`📄 New file detected: ${path.relative(projectDir, file)}`);
        watchFile(file);
        updateCssFiles(file);
      } catch (err) {
        console.error(`❌ Error adding ${path.relative(projectDir, file)}: ${err.message}`);
      }
    });
  }, 10000);
}

// Initial execution and start watching
updateCssFiles().then(() => {
  watchHtmlFiles();
});
