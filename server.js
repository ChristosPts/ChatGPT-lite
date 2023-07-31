const helmet = require('helmet');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const favicon = require('express-favicon');
const http = require('http');
const WebSocket = require('ws');
const fetch = require('node-fetch');

require('dotenv').config();
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net", "https://gpt-lite-production.up.railway.app"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net", "data:"],
      connectSrc: ["'self'", "https://api.openai.com", "*"],
      objectSrc: ["'none'"],
      mediaSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  })
);

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const PORT = process.env.PORT || 3333;
const API_KEY = process.env.API_KEY;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    console.log('Received message:', message);

    // Process the message and send a response
    const response = 'This is a WebSocket response';
    ws.send(response);
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

app.post('/completions', async (req, res) => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: req.body.messages }],
      max_tokens: 500,
    }),
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error(error);
  }
});

server.listen(PORT, () => console.log('Server is listening on port ' + PORT));