const CleanCSS = require('clean-css');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '_site', 'style.css');
const outputFile = path.join(__dirname, '_site', 'style.css');

const css = fs.readFileSync(inputFile, 'utf8');
const output = new CleanCSS({
  level: 2
}).minify(css);

if (output.errors.length > 0) {
  console.error('CSS minification errors:', output.errors);
  process.exit(1);
}

fs.writeFileSync(outputFile, output.styles);

const originalSize = (css.length / 1024).toFixed(2);
const minifiedSize = (output.styles.length / 1024).toFixed(2);
const savings = (((css.length - output.styles.length) / css.length) * 100).toFixed(2);

console.log(`CSS minified: ${originalSize}KB → ${minifiedSize}KB (${savings}% reduction)`);
