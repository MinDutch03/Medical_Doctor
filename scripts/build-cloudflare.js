const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running Vercel build...');
execSync('npx vercel build', { stdio: 'inherit' });

console.log('Creating .assetsignore file...');
const assetsDir = path.join(process.cwd(), '.vercel', 'output', 'static');
const assetsIgnorePath = path.join(assetsDir, '.assetsignore');

// Create the directory if it doesn't exist
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create .assetsignore file with _worker.js exclusion
fs.writeFileSync(assetsIgnorePath, '_worker.js\n', 'utf8');

console.log('✓ Created .assetsignore file');
console.log('Build complete!');

