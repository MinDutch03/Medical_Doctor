const fs = require('fs');
const path = require('path');

const assetsDir = path.join(process.cwd(), '.vercel', 'output', 'static');
const assetsIgnorePath = path.join(assetsDir, '.assetsignore');

// Create the directory if it doesn't exist
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create .assetsignore file with _worker.js exclusion
fs.writeFileSync(assetsIgnorePath, '_worker.js\n', 'utf8');

console.log('Created .assetsignore file at:', assetsIgnorePath);

