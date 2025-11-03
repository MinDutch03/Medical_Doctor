const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running Vercel build...');
try {
  execSync('npx vercel build', { stdio: 'inherit' });
} catch (error) {
  console.error('Vercel build failed:', error);
  process.exit(1);
}

console.log('Creating .assetsignore file...');
const assetsDir = path.join(process.cwd(), '.vercel', 'output', 'static');
const assetsIgnorePath = path.join(assetsDir, '.assetsignore');

// Copy _routes.json to build output root if it exists
const routesJsonPath = path.join(process.cwd(), 'public', '_routes.json');
const outputRoutesJsonPath = path.join(assetsDir, '_routes.json');
if (fs.existsSync(routesJsonPath)) {
  fs.copyFileSync(routesJsonPath, outputRoutesJsonPath);
  console.log('✓ Copied _routes.json to build output');
}

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
  } else {
    console.error('✗ Failed to create .assetsignore file');
    process.exit(1);
  }
} catch (error) {
  console.error('✗ Error creating .assetsignore:', error);
  process.exit(1);
}

console.log('Build complete!');

