// Setup Checker for Gammaprep Website
// Run with: node check-setup.js

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🔍 Checking Gammaprep Setup...\n');

let issues = [];
let warnings = [];

// Check 1: Node modules
console.log('📦 Checking dependencies...');
const backendNodeModules = fs.existsSync(path.join(__dirname, 'backend', 'node_modules'));
const frontendNodeModules = fs.existsSync(path.join(__dirname, 'frontend', 'node_modules'));

if (!backendNodeModules) {
  issues.push('❌ Backend node_modules not found. Run: cd backend && npm install');
} else {
  console.log('✅ Backend dependencies installed');
}

if (!frontendNodeModules) {
  issues.push('❌ Frontend node_modules not found. Run: cd frontend && npm install');
} else {
  console.log('✅ Frontend dependencies installed');
}

// Check 2: Environment file
console.log('\n🔧 Checking configuration...');
const backendEnv = fs.existsSync(path.join(__dirname, 'backend', '.env'));

if (!backendEnv) {
  issues.push('❌ Backend .env file not found. Create it with MongoDB URI and JWT secret');
} else {
  console.log('✅ Backend .env file exists');
  
  // Read and check env contents
  const envContent = fs.readFileSync(path.join(__dirname, 'backend', '.env'), 'utf8');
  if (!envContent.includes('MONGODB_URI')) {
    warnings.push('⚠️  MONGODB_URI not found in .env file');
  }
  if (!envContent.includes('JWT_SECRET')) {
    warnings.push('⚠️  JWT_SECRET not found in .env file');
  }
}

// Check 3: Backend server
console.log('\n🌐 Checking backend server...');
const backendCheck = http.get('http://localhost:5000/api/health', (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Backend server is running on port 5000');
  } else {
    warnings.push('⚠️  Backend responded but with status: ' + res.statusCode);
  }
}).on('error', (err) => {
  issues.push('❌ Backend server is NOT running. Start it with: cd backend && npm run dev');
});

// Check 4: Frontend server
setTimeout(() => {
  console.log('\n🎨 Checking frontend server...');
  const frontendCheck = http.get('http://localhost:3000', (res) => {
    if (res.statusCode === 200) {
      console.log('✅ Frontend server is running on port 3000');
    } else {
      warnings.push('⚠️  Frontend responded but with status: ' + res.statusCode);
    }
    printSummary();
  }).on('error', (err) => {
    warnings.push('⚠️  Frontend server is NOT running. Start it with: cd frontend && npm run dev');
    printSummary();
  });
}, 1000);

function printSummary() {
  setTimeout(() => {
    console.log('\n' + '='.repeat(60));
    console.log('📋 SUMMARY');
    console.log('='.repeat(60));
    
    if (issues.length === 0 && warnings.length === 0) {
      console.log('\n🎉 All checks passed! Your setup looks good.\n');
      console.log('If you still have issues:');
      console.log('1. Make sure MongoDB is running');
      console.log('2. Check browser console (F12) for errors');
      console.log('3. Check backend terminal for error messages');
      console.log('\nSee TROUBLESHOOTING.md for more help.');
    } else {
      if (issues.length > 0) {
        console.log('\n❌ ISSUES FOUND:');
        issues.forEach(issue => console.log('  ' + issue));
      }
      
      if (warnings.length > 0) {
        console.log('\n⚠️  WARNINGS:');
        warnings.forEach(warning => console.log('  ' + warning));
      }
      
      console.log('\n📖 Next Steps:');
      console.log('1. Fix the issues listed above');
      console.log('2. Make sure MongoDB is running');
      console.log('3. Start backend: cd backend && npm run dev');
      console.log('4. Start frontend: cd frontend && npm run dev');
      console.log('\nSee TROUBLESHOOTING.md for detailed help.');
    }
    console.log('\n' + '='.repeat(60) + '\n');
  }, 500);
}

