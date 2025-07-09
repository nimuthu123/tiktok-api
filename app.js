const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

// API endpoint
app.get('/api/download', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing TikTok video URL' });
  }

  try {
    const apiUrl = `${process.env.TIKWM_API}?url=${encodeURIComponent(videoUrl)}&hd=1`;

    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || data.code !== 0) {
      return res.status(500).json({ error: 'Failed to fetch video info from TikWM' });
    }

    return res.json({
      id: data.data.id,
      title: data.data.title,
      author: data.data.author.nickname,
      region: data.data.region,
      duration: data.data.duration,
      cover: data.data.cover,
      play: data.data.play,             // No watermark
      wmplay: data.data.wmplay,         // With watermark
      music: data.data.music            // Audio URL
    });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ TikTok API running at: http://localhost:${PORT}/api/download?url=<TikTok_URL>`);
});
