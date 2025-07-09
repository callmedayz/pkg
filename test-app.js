#!/usr/bin/env node

/**
 * Simple test application for PKG revival
 * Tests basic functionality and Node.js version detection
 */

console.log('🚀 PKG Revival Test Application');
console.log('===============================');
console.log('');

// Display Node.js version information
console.log('Node.js Information:');
console.log(`  Version: ${process.version}`);
console.log(`  Platform: ${process.platform}`);
console.log(`  Architecture: ${process.arch}`);
console.log(`  ABI Version: ${process.versions.modules}`);
console.log('');

// Display process information
console.log('Process Information:');
console.log(`  PID: ${process.pid}`);
console.log(`  Executable: ${process.execPath}`);
console.log(`  Working Directory: ${process.cwd()}`);
console.log('');

// Test command line arguments
if (process.argv.length > 2) {
  console.log('Command Line Arguments:');
  process.argv.slice(2).forEach((arg, index) => {
    console.log(`  [${index}]: ${arg}`);
  });
  console.log('');
}

// Test environment variables
console.log('Environment Variables:');
console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`  PATH: ${process.env.PATH ? 'defined' : 'undefined'}`);
console.log('');

// Test basic functionality
console.log('Functionality Tests:');

// Test file system access
try {
  const fs = require('fs');
  const packageJson = fs.readFileSync('./package.json', 'utf8');
  const pkg = JSON.parse(packageJson);
  console.log(
    `  ✅ File system access: OK (package: ${pkg.name}@${pkg.version})`,
  );
} catch (error) {
  console.log(`  ❌ File system access: FAILED (${error.message})`);
}

// Test module loading
try {
  const path = require('path');
  const testPath = path.join(__dirname, 'test-app.js');
  console.log(`  ✅ Module loading: OK (path: ${testPath})`);
} catch (error) {
  console.log(`  ❌ Module loading: FAILED (${error.message})`);
}

// Test JSON parsing
try {
  const testData = { test: true, timestamp: Date.now() };
  const json = JSON.stringify(testData);
  const parsed = JSON.parse(json);
  console.log(`  ✅ JSON processing: OK (timestamp: ${parsed.timestamp})`);
} catch (error) {
  console.log(`  ❌ JSON processing: FAILED (${error.message})`);
}

// Test async functionality
async function testAsync() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 10));
    console.log('  ✅ Async/await: OK');
  } catch (error) {
    console.log(`  ❌ Async/await: FAILED (${error.message})`);
  }
}

testAsync()
  .then(() => {
    console.log('');
    console.log('🎉 Test completed successfully!');
    console.log('');

    // Display build information if available
    if (process.pkg) {
      console.log('PKG Build Information:');
      console.log(`  Entrypoint: ${process.pkg.entrypoint}`);
      console.log(`  Default Entrypoint: ${process.pkg.defaultEntrypoint}`);
      console.log('');
    } else {
      console.log('Running in development mode (not packaged)');
      console.log('');
    }

    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  });
