import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

async function backup() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    // Extract database name from URI
    const dbName = mongoUri.split('/').pop()?.split('?')[0] || '4it-platform';
    
    // Create backup directory
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Generate backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}`);

    console.log('Starting database backup...');
    console.log(`Database: ${dbName}`);
    console.log(`Backup path: ${backupPath}`);

    // Run mongodump
    const command = `mongodump --uri="${mongoUri}" --out="${backupPath}"`;
    await execAsync(command);

    console.log('✅ Backup completed successfully!');
    console.log(`Backup saved to: ${backupPath}`);

    // Clean up old backups (keep last 7 days)
    const files = fs.readdirSync(backupDir);
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    files.forEach((file) => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      if (stats.mtimeMs < sevenDaysAgo) {
        fs.rmSync(filePath, { recursive: true, force: true });
        console.log(`Deleted old backup: ${file}`);
      }
    });

  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
}

backup();
