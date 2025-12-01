const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Pretty JSON printer
function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

app.get("/", (req, res) => {
  res.send(
    pretty({
      success: true,
      author: "ItachiXD",
      message: "Facebook Downloader API Running"
    })
  );
});

// FACEBOOK ONLY DOWNLOAD ENDPOINT
app.get("/api/download", async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send(
      pretty({
        success: false,
        author: "ItachiXD",
        message: "Missing parameter ?url="
      })
    );
  }

  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      Origin: "https://downloady.vercel.app",
      Referer: "https://downloady.vercel.app/",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0 Mobile Safari/537.36"
    };

    //  Call the Facebook backend API ONLY
    const fbResponse = await axios.post(
      "https://downloady.vercel.app/api/initiate-download",
      { url: videoUrl },
      { headers }
    );

    const data = fbResponse.data;

    // Extract one clean Facebook video URL
    const finalUrl =
      data?.videoUrl ||
      data?.download_url ||
      data?.url ||
      data?.links?.download ||
      data?.links?.[0] ||
      null;

    if (!finalUrl) {
      return res.status(500).send(
        pretty({
          success: false,
          author: "ItachiXD",
          message: "Unable to extract Facebook video URL",
          raw: data
        })
      );
    }

    // Final Clean Output
    return res.send(
      pretty({
        success: true,
        author: "ItachiXD",
        platform: "Facebook",
        download_url: finalUrl
      })
    );
  } catch (err) {
    return res.status(500).send(
      pretty({
        success: false,
        author: "ItachiXD",
        message: "Facebook API error",
        error: err.response?.data || err.message
      })
    );
  }
});

module.exports = app;
