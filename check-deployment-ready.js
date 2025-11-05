#!/usr/bin/env node

/**
 * Pre-Deployment Security Check
 * Run this before pushing to GitHub
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Checking deployment readiness...\n');

let allChecks = true;

// Check 1: .env file exists
console.log('1. Checking if backend/.env exists...');
if (fs.existsSync(path.join(__dirname, 'backend', '.env'))) {
  console.log('   ✅ backend/.env exists');
} else {
  console.log('   ❌ backend/.env NOT found!');
  allChecks = false;
}

// Check 2: .gitignore exists and contains .env
console.log('\n2. Checking .gitignore configuration...');
if (fs.existsSync(path.join(__dirname, '.gitignore'))) {
  const gitignore = fs.readFileSync(path.join(__dirname, '.gitignore'), 'utf8');
  if (gitignore.includes('.env') && gitignore.includes('backend/.env')) {
    console.log('   ✅ .gitignore properly configured');
  } else {
    console.log('   ❌ .gitignore missing .env entries!');
    allChecks = false;
  }
} else {
  console.log('   ❌ .gitignore NOT found!');
  allChecks = false;
}

// Check 3: Verify .env has required variables
console.log('\n3. Checking environment variables...');
try {
  const envContent = fs.readFileSync(path.join(__dirname, 'backend', '.env'), 'utf8');
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'CASHFREE_APP_ID',
    'CASHFREE_SECRET_KEY',
    'FRONTEND_URL'
  ];
  
  const missingVars = [];
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName + '=')) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length === 0) {
    console.log('   ✅ All required environment variables present');
  } else {
    console.log('   ❌ Missing variables:', missingVars.join(', '));
    allChecks = false;
  }
  
  // Check for placeholder values
  if (envContent.includes('your_cashfree_app_id') || 
      envContent.includes('your_cashfree_secret_key')) {
    console.log('   ⚠️  Warning: Cashfree credentials still contain placeholders');
  }
} catch (err) {
  console.log('   ❌ Could not read backend/.env');
  allChecks = false;
}

// Check 4: Verify README doesn't contain secrets
console.log('\n4. Checking README for hardcoded secrets...');
const readmeFiles = ['README.md', 'backend/README.md', 'SETUP_GUIDE.md'];
let secretsFound = false;

// Common patterns to avoid (actual values, not placeholders)
const dangerousPatterns = [
  /mongodb\+srv:\/\/[^:]+:[^@]+@cluster/i,  // Real MongoDB URI with password
  /\b[0-9a-f]{32,}\b/i  // Long hex strings (likely keys)
];

readmeFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if it contains obvious placeholders
    if (content.includes('your_password') || 
        content.includes('your_secret') ||
        content.includes('username:password')) {
      return; // This is fine, it's a placeholder
    }
    
    dangerousPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        console.log(`   ⚠️  Warning: ${file} might contain real credentials`);
        secretsFound = true;
      }
    });
  }
});

if (!secretsFound) {
  console.log('   ✅ No obvious secrets found in documentation');
} else {
  console.log('   ⚠️  Please review the files mentioned above');
}

// Check 5: Deployment config files exist
console.log('\n5. Checking deployment configuration files...');
const configFiles = ['railway.json', 'vercel.json'];
let configsExist = true;

configFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ⚠️  ${file} not found (optional but recommended)`);
  }
});

// Check 6: Package.json files exist
console.log('\n6. Checking package.json files...');
const packageFiles = ['package.json', 'backend/package.json', 'frontend/package.json'];
let allPackagesExist = true;

packageFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} NOT found!`);
    allPackagesExist = false;
    allChecks = false;
  }
});

// Final Summary
console.log('\n' + '='.repeat(50));
if (allChecks) {
  console.log('✅ ALL CHECKS PASSED! Ready for deployment! 🚀');
  console.log('\nNext steps:');
  console.log('1. git init');
  console.log('2. git add .');
  console.log('3. git commit -m "Initial commit"');
  console.log('4. Create GitHub repo and push');
  console.log('5. Follow DEPLOYMENT_GUIDE.md');
} else {
  console.log('❌ SOME CHECKS FAILED!');
  console.log('\nPlease fix the issues above before deploying.');
  console.log('See SECURITY_CHECKLIST.md for details.');
}
console.log('='.repeat(50) + '\n');

// Check 7: Bonus - Test if git is initialized
console.log('7. Checking Git status...');
if (fs.existsSync(path.join(__dirname, '.git'))) {
  console.log('   ✅ Git repository initialized');
  console.log('   💡 Run: git status');
  console.log('   💡 Make sure backend/.env is NOT listed!');
} else {
  console.log('   ℹ️  Git not initialized yet');
  console.log('   💡 Run: git init');
}

console.log('\n📚 Documentation:');
console.log('   - DEPLOYMENT_GUIDE.md - Detailed steps');
console.log('   - QUICK_DEPLOY.md - Quick reference');
console.log('   - SECURITY_CHECKLIST.md - Security verification');
console.log('   - DEPLOYMENT_SUMMARY.md - Overview\n');

process.exit(allChecks ? 0 : 1);

