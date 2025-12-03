const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const GROQ_KEY = process.env.GROQ_API_KEY;
const AI_PROVIDER = process.env.AI_PROVIDER || 'groq';

if (!GROQ_KEY && !OPENAI_KEY) {
  console.warn('Warning: No AI API key set. Please set GROQ_API_KEY or OPENAI_API_KEY in .env file.');
} else {
  console.log(`Using AI provider: ${AI_PROVIDER}`);
}

app.use(express.json());

// Basic CORS for local development so the client (live-server) can call the API.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Serve static site (home folder)
app.use(express.static(path.join(__dirname, 'home')));

app.post('/api/chat', async (req, res) => {
  try {
    const { topic = 'General', message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'Missing message' });

    const systemPrompt = `Bạn là chuyên gia tư vấn về ${topic}. Hãy trả lời bằng tiếng Việt một cách thân thiện, súc tích và hữu ích. Đưa ra lời khuyên thực tế và các bước hành động cụ thể khi phù hợp.`;

    let apiUrl, apiKey, model;
    
    // Chọn AI provider dựa trên cấu hình
    if (AI_PROVIDER === 'groq' && GROQ_KEY) {
      apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
      apiKey = GROQ_KEY;
      model = 'llama-3.1-8b-instant'; // Model miễn phí, rất nhanh
    } else if (OPENAI_KEY) {
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      apiKey = OPENAI_KEY;
      model = 'gpt-3.5-turbo';
    } else {
      return res.status(500).json({ 
        error: 'No AI API key configured. Please set GROQ_API_KEY or OPENAI_API_KEY in .env file.' 
      });
    }

    const body = {
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7
    };

    const r = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      const text = await r.text();
      console.error('API Error:', text);
      return res.status(r.status).send(text);
    }

    const json = await r.json();
    const reply = json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content;
    res.json({ reply: reply || 'Không có phản hồi từ AI.' });
  } catch (err) {
    console.error('Chat error', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home', 'home.html'));
});

app.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
});
