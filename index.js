const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.get('/api/fb', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, error: 'Missing URL' });

  try {
    const response = await axios.get(`https://facebook-dl.vercel.app/api/facebook?url=${encodeURIComponent(url)}`);
    const videoData = response.data;

    res.json({
      success: true,
      data: {
        developer: "Denish x Ryukazi",
        status: true,
        data: [
          {
            title: videoData.title,
            thumbnail: videoData.thumbnail,
            hd_link: videoData.hd_link,
            sd_link: videoData.sd_link
          }
        ]
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch video info',
      details: err.message
    });
  }
});

app.listen(PORT, () => console.log(`Facebook downloader API running on port ${PORT}`));
