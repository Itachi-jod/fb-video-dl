// index.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Pretty Print function
function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

app.get("/api/facebook", async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send(
      pretty({
        author: "ItachiXD",
        success: false,
        message: "Missing ?url parameter",
      })
    );
  }

  try {
    // Perfect headers (VERY IMPORTANT)
    const headers = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
      Referer: "https://facebook-di.vercel.app/",
      Origin: "https://facebook-di.vercel.app",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
    };

    // UPSTREAM API (GET)
    const fbApi = `https://facebook-di.vercel.app/api/facebook?url=${encodeURIComponent(
      videoUrl
    )}`;

    const apiRes = await axios.get(fbApi, { headers });

    res.setHeader("Content-Type", "application/json");
    return res.send(
      pretty({
        author: "ItachiXD",
        success: true,
        platform: "Facebook",
        data: apiRes.data,
      })
    );
  } catch (err) {
    console.error("Upstream Error:", err.response?.data || err.message);

    res.status(500).send(
      pretty({
        author: "ItachiXD",
        success: false,
        message: "Upstream request failed",
        upstream_status: err.response?.status || "unknown",
        upstream_message: err.response?.data || err.message,
      })
    );
  }
});

// Default route
app.get("/", (req, res) => {
  res.send(
    pretty({
      author: "ItachiXD",
      status: "Facebook Downloader API is running...",
      endpoint: "/api/facebook?url=<video-url>",
    })
  );
});

module.exports = app;
