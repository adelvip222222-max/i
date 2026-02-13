import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';

const execAsync = promisify(exec);

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: CheckResult[] = [];

async function runCheck(name: string, command: string): Promise<boolean> {
  try {
    console.log(`\n🔍 Running: ${name}...`);
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr && !stderr.includes('warning')) {
      console.log(`❌ ${name} failed`);
      console.error(stderr);
      results.push({ name, passed: false, message: stderr });
      return false;
    }
    
    console.log(`✅ ${name} passed`);
    results.push({ name, passed: true, message: 'Success' });
    return true;
  } catch (error: any) {
    console.log(`❌ ${name} failed`);
    console.error(error.message);
    results.push({ name, passed: false, message: error.message });
    return false;
  }
}

function checkEnvFile(): boolean {
  console.log('\n🔍 Checking environment variables...');
  
  const requiredVars = [
    'MONGODB_URI',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];
  
  const missing: string[] = [];
  
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    console.log(`❌ Missing environment variables: ${missing.join(', ')}`);
    results.push({
      name: 'Environment Variables',
      passed: false,
      message: `Missing: ${missing.join(', ')}`,
    });
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  results.push({
    name: 'Environment Variables',
    passed: true,
    message: 'All required variables present',
  });
  return true;
}

function checkFiles(): boolean {
  console.log('\n🔍 Checking required files...');
  
  const requiredFiles = [
    'package.json',
    'next.config.mjs',
    'tsconfig.json',
    '.env.example',
    '.env.production.example',
  ];
  
  const missing: string[] = [];
  
  requiredFiles.forEach((file) => {
    if (!fs.existsSync(file)) {
      missing.push(file);
    }
  });
  
  if (missing.length > 0) {
    console.log(`❌ Missing files: ${missing.join(', ')}`);
    results.push({
      name: 'Required Files',
      passed: false,
      message: `Missing: ${missing.join(', ')}`,
    });
    return false;
  }
  
  console.log('✅ All required files present');
  results.push({
    name: 'Required Files',
    passed: true,
    message: 'All files present',
  });
  return true;
}

async function main() {
  console.log('🚀 Starting deployment checks...\n');
  console.log('=' .repeat(50));
  
  // Check files
  checkFiles();
  
  // Check environment variables
  checkEnvFile();
  
  // Run type check
  await runCheck('Type Check', 'npx tsc --noEmit');
  
  // Run linting
  await runCheck('Linting', 'npm run lint');
  
  // Run build
  await runCheck('Build', 'npm run build');
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Deployment Check Summary:\n');
  
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  
  results.forEach((result) => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.message}`);
  });
  
  console.log(`\n${passed}/${total} checks passed`);
  
  if (passed === total) {
    console.log('\n🎉 All checks passed! Ready for deployment.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some checks failed. Please fix the issues before deploying.');
    process.exit(1);
  }
}

main();
