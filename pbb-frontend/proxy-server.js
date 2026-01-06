import express from 'express';
import cors from 'cors';
import axios from 'axios';
import https from 'https';
import fs from 'fs';
import os from 'os';

const app = express();
const PORT = 3000;

// Get local IP address (prioritize WiFi over VirtualBox)
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  // First, try to find WiFi interface
  if (interfaces['Wi-Fi']) {
    for (const iface of interfaces['Wi-Fi']) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  // Fallback: find any non-internal IPv4 that's not 169.254.x.x
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal && !iface.address.startsWith('169.254')) {
        return iface.address;
      }
    }
  }
  
  return 'localhost';
}

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Proxy all /api requests to production
app.use('/api', async (req, res) => {
  try {
    const url = `https://purebhaktibase.com:8443${req.originalUrl}`;
    console.log(`Proxying: ${req.method} ${url}`);
    
    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message
    });
  }
});

// SSL certificate options
const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost-cert.pem')
};

const localIP = getLocalIP();

https.createServer(options, app).listen(PORT, localIP, () => {
  console.log(`✅ HTTPS Proxy server running on https://${localIP}:${PORT}`);
  console.log(`🌐 Local access: https://localhost:${PORT}`);
  console.log(`📱 Mobile app should use: https://${localIP}:${PORT}`);
  console.log(`\n💡 Update your mobile app API_BASE_URL to: https://${localIP}:${PORT}`);
});