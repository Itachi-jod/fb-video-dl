const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Pretty Print helper
function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

app.get("/api/download", async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res
      .status(400)
      .send(pretty({ error: "Missing ?url=" }));
  }

  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
      Origin: "https://downloady.vercel.app",
      Referer: "https://downloady.vercel.app/",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
    };

    const apiRes = await axios.post(
      "https://downloady.vercel.app/api/initiate-download",
      { url: videoUrl },
      { headers }
    );

    res.setHeader("Content-Type", "application/json");
    return res.send(
      pretty({
        author: "ItachiXD",
        success: true,
        data: apiRes.data,
      })
    );
  } catch (err) {
    console.error("Backend error:", err.response?.data || err.message);

    res.setHeader("Content-Type", "application/json");
    return res.status(500).send(
      pretty({
        author: "ItachiXD",
        success: false,
        error: "Failed to process the request",
        details: err.response?.data || err.message,
      })
    );
  }
});

app.get("/", (req, res) => {
  res.send(
    pretty({
      author: "ItachiXD",
      status: "Video Downloader API Running...",
    })
  );
});

module.exports = app;
