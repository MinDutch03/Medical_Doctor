const fs = require('fs');
const path = require('path');

const assetsDir = path.join(process.cwd(), '.vercel', 'output', 'static');
const assetsIgnorePath = path.join(assetsDir, '.assetsignore');

console.log('Current working directory:', process.cwd());
console.log('Looking for assets directory at:', assetsDir);

try {
  // Check if assets directory exists
  if (!fs.existsSync(assetsDir)) {
    console.warn('Assets directory does not exist:', assetsDir);
    console.warn('Creating directory...');
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // Create .assetsignore file with _worker.js exclusion
  fs.writeFileSync(assetsIgnorePath, '_worker.js\n', 'utf8');

  console.log('✓ Created .assetsignore file at:', assetsIgnorePath);
  
  // Verify it was created
  if (fs.existsSync(assetsIgnorePath)) {
    const content = fs.readFileSync(assetsIgnorePath, 'utf8');
    console.log('✓ Verified .assetsignore content:', content.trim());
    console.log('✓ File size:', fs.statSync(assetsIgnorePath).size, 'bytes');
  } else {
    console.error('✗ Failed to create .assetsignore file');
    process.exit(1);
  }
} catch (error) {
  console.error('✗ Error creating .assetsignore:', error);
  process.exit(1);
}

