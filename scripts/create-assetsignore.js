const fs = require('fs');
const path = require('path');

const assetsDir = path.join(process.cwd(), '.vercel', 'output', 'static');
const assetsIgnorePath = path.join(assetsDir, '.assetsignore');

console.log('Current working directory:', process.cwd());
console.log('Looking for assets directory at:', assetsDir);

// Check if _worker.js exists as directory or file
const workerPath = path.join(assetsDir, '_worker.js');
if (fs.existsSync(workerPath)) {
  const stats = fs.statSync(workerPath);
  console.log('Found _worker.js:', stats.isDirectory() ? 'directory' : 'file');
}

try {
  // Check if assets directory exists
  if (!fs.existsSync(assetsDir)) {
    console.warn('Assets directory does not exist:', assetsDir);
    console.warn('Creating directory...');
    fs.mkdirSync(assetsDir, { recursive: true });
  } else {
    console.log('✓ Assets directory exists');
  }

  // Create .assetsignore file with _worker.js exclusion
  // Also exclude it as a directory pattern
  const ignoreContent = '_worker.js\n_worker.js/**\n';
  fs.writeFileSync(assetsIgnorePath, ignoreContent, 'utf8');

  console.log('✓ Created .assetsignore file at:', assetsIgnorePath);
  
  // Verify it was created and has correct content
  if (fs.existsSync(assetsIgnorePath)) {
    const content = fs.readFileSync(assetsIgnorePath, 'utf8');
    console.log('✓ Verified .assetsignore content:');
    console.log(content);
    console.log('✓ File size:', fs.statSync(assetsIgnorePath).size, 'bytes');
    
    // List files in assets directory for debugging
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      console.log('Files in assets directory:', files.slice(0, 10).join(', '), '...');
    }
  } else {
    console.error('✗ Failed to create .assetsignore file');
    process.exit(1);
  }
} catch (error) {
  console.error('✗ Error creating .assetsignore:', error);
  console.error('Error details:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

