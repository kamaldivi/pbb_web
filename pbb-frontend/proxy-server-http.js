import express from 'express';
import cors from 'cors';
import axios from 'axios';
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

const localIP = getLocalIP();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ HTTP Proxy server running on http://0.0.0.0:${PORT}`);
  console.log(`🌐 Local access: http://localhost:${PORT}`);
  console.log(`📱 Mobile app should use: http://${localIP}:${PORT}`);
  console.log(`\n💡 Test in browser: http://localhost:${PORT}/api/v1/books?page=1&size=100`);
});