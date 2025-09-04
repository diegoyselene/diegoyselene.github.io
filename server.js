// backend.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 5000;

// Replace with your Pexels API key
const PEXELS_KEY = "c5JRSHU3S4Y9yYM9eg8lZ3twpVXbc4S7qWl92do2xbUUF1ex9BYy10dT";

app.use(cors());

app.get("/api/images", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query parameter" });

  try {
    const pexelsRes = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6`, {
      headers: { Authorization: PEXELS_KEY }
    });
    if (!pexelsRes.ok) throw new Error(`Pexels API error: ${pexelsRes.status}`);

    const data = await pexelsRes.json();
    // Only return the fields your front-end needs
    const photos = data.photos.map(p => ({
      src: { large2x: p.src.large2x },
      url: p.url
    }));

    res.json({ photos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
