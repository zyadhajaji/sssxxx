const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API route
app.post('/api/download', async (req, res) => {
  const { url, option } = req.body;

  if (!url) return res.json({ success: false, error: "No URL provided." });

  try {
    // Use TikWM API
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.data) {
      let videoLink = '';
      if (option === 'hd') {
        videoLink = data.data.play;  // HD no watermark
      } else if (option === 'watermark') {
        videoLink = data.data.wmplay;  // With watermark
      } else if (option === 'mp3') {
        videoLink = data.data.music;  // Audio only
      }
      return res.json({ success: true, link: videoLink });
    } else {
      return res.json({ success: false, error: 'Video not found.' });
    }
  } catch (err) {
    console.error(err);
    return res.json({ success: false, error: 'Failed to fetch video.' });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
