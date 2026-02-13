const http = require('http');

const options = {
  hostname: process.env.HEALTH_CHECK_HOST || 'localhost',
  port: process.env.PORT || 3000,
  path: '/api/health',
  method: 'GET',
  timeout: 5000,
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const health = JSON.parse(data);
      
      if (res.statusCode === 200 && health.status === 'healthy') {
        console.log('✅ Health check passed');
        console.log(`Database: ${health.database}`);
        console.log(`Uptime: ${Math.floor(health.uptime)}s`);
        process.exit(0);
      } else {
        console.error('❌ Health check failed');
        console.error(`Status: ${health.status}`);
        console.error(`Database: ${health.database}`);
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Invalid health check response');
      console.error(error.message);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Health check request failed');
  console.error(error.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ Health check timeout');
  req.destroy();
  process.exit(1);
});

req.end();
