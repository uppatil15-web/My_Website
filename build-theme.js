const fs = require('fs');
const path = require('path');
const less = require('less');
const archiver = require('archiver');

const STYLES_DIR = path.join(__dirname, 'styles');
const MAIN_LESS = path.join(STYLES_DIR, 'main.less');
const OUTPUT_CSS = path.join(__dirname, 'assets', 'css', 'main_style.css');
const ROOT_ZIP = path.join(__dirname, 'birdseye-website-export.zip');

async function compileLess(variation = 'light') {
  try {
    const lessContent = fs.readFileSync(MAIN_LESS, 'utf8');
    
    // Choose variation variables file
    const varFile = variation === 'dark' ? 'variables_dark.less' : 'variables_light.less';
    const varPath = path.join(STYLES_DIR, varFile);
    let varContent = '';
    if (fs.existsSync(varPath)) {
      varContent = fs.readFileSync(varPath, 'utf8');
    }

    const fullLess = `${varContent}\n${lessContent}`;

    const output = await less.render(fullLess, {
      paths: [STYLES_DIR],
      filename: MAIN_LESS,
      compress: false
    });

    fs.writeFileSync(OUTPUT_CSS, output.css, 'utf8');
    console.log(`[Build] LESS compiled successfully to assets/css/main_style.css (${variation} mode)`);
    return output.css;
  } catch (err) {
    console.error('[Build Error] Failed to compile LESS:', err);
    throw err;
  }
}

async function packageZip() {
  await compileLess('light');

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(ROOT_ZIP);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`[Export] Zip created: ${ROOT_ZIP} (${archive.pointer()} total bytes)`);
      resolve(ROOT_ZIP);
    });

    archive.on('error', (err) => reject(err));
    archive.pipe(output);

    // Append theme files from root directory
    archive.glob('**/*', {
      cwd: __dirname,
      ignore: ['node_modules/**', '*.zip', '.git/**', '.DS_Store', 'build-theme.js', 'dev-server.js', 'package*.json']
    });
    archive.finalize();
  });
}

if (require.main === module) {
  packageZip()
    .then(() => console.log('Standalone website build complete! Ready for deployment (birdseye-website-export.zip)'))
    .catch((err) => console.error('Build failed:', err));
}

module.exports = { compileLess, packageZip };
