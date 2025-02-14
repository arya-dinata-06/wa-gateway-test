// server.js
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(express.static('public'));

let client = null;
let qrCode = null;
let isClientReady = false;

// Initialize WhatsApp Client
async function initializeClient() {
  try {
    if (client) {
      await client.destroy();
    }
    
    client = new Client({
      authStrategy: new LocalAuth({ clientId: "whatsapp-" + Date.now() }),
      puppeteer: { 
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ]
      }
    });

    client.on('qr', async (qr) => {
      qrCode = await qrcode.toDataURL(qr);
      console.log('QR Code baru generated');
    });

    client.on('ready', () => {
      console.log('Client is ready!');
      isClientReady = true;
      qrCode = null;
    });

    client.on('authenticated', () => {
      console.log('Authenticated!');
    });

    client.on('auth_failure', msg => {
      console.error('Authentication failure:', msg);
      qrCode = null;
      isClientReady = false;
    });

    await client.initialize();
  } catch (error) {
    console.error('Error initializing client:', error);
    qrCode = null;
    isClientReady = false;
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/qr', (req, res) => {
  if (qrCode) {
    res.json({ qr: qrCode });
  } else if (isClientReady) {
    res.json({ qr: null, message: 'Client sudah terkoneksi' });
  } else {
    res.json({ qr: null, message: 'QR Code belum tersedia, tunggu sebentar...' });
  }
});

app.post('/api/send-message', async (req, res) => {
  if (!isClientReady) {
    return res.status(400).json({ success: false, message: 'Client not ready' });
  }

  const { number, message } = req.body;
  
  try {
    const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
    const sendResult = await client.sendMessage(chatId, message);
    res.json({ success: true, messageId: sendResult.id._serialized });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/reset', async (req, res) => {
  try {
    console.log('Memulai reset client...');
    if (client) {
      console.log('Menghentikan client lama...');
      await client.destroy();
      client = null;
      qrCode = null;
      isClientReady = false;
    }
    
    console.log('Menginisialisasi client baru...');
    await initializeClient();
    
    // Tunggu sebentar untuk memastikan QR code ter-generate
    setTimeout(() => {
      if (qrCode) {
        res.json({ success: true, message: 'Reset berhasil, QR code baru tersedia' });
      } else {
        res.json({ success: false, message: 'Reset berhasil, tapi QR code belum tersedia. Silakan refresh halaman.' });
      }
    }, 5000);
    
  } catch (error) {
    console.error('Error saat reset:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Initialize client when server starts
initializeClient();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
