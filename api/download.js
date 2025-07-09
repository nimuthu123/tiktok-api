const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing TikTok video URL' });
  }

  try {
    const response = await axios.get(`https://tikwm.com/api?url=${encodeURIComponent(url)}&hd=1`);
    const data = response.data;

    if (data.code !== 0) {
      return res.status(500).json({ error: 'Failed to fetch from TikWM' });
    }

    res.status(200).json({
      id: data.data.id,
      title: data.data.title,
      author: data.data.author.nickname,
      play: data.data.play,
      cover: data.data.cover
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', detail: error.message });
  }
};
