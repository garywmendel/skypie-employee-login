// SkyPie — Employee Sign In (Harri) · design prototype host
// Static server. No data, no persistence, no external calls.

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const CODE = (process.env.SKYPIE_ACCESS_CODE || "").trim();

// Health check stays open so Railway can reach it without credentials.
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, gated: Boolean(CODE) });
});

// Optional browser-native gate. Unset SKYPIE_ACCESS_CODE to leave it public.
if (CODE) {
  app.use((req, res, next) => {
    const header = req.headers.authorization || "";
    if (header.startsWith("Basic ")) {
      const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
      const supplied = decoded.slice(decoded.indexOf(":") + 1);
      if (supplied === CODE) return next();
    }
    res.set("WWW-Authenticate", 'Basic realm="SkyPie prototype"');
    return res.status(401).send("Access code required.");
  });
}

app.use(
  express.static(path.join(__dirname, "public"), {
    extensions: ["html"],
    setHeaders: (res) => {
      res.set("Cache-Control", "no-store");
      res.set("X-Robots-Tag", "noindex, nofollow");
    }
  })
);

app.use((req, res) => {
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SkyPie prototype listening on ${PORT} (gated: ${Boolean(CODE)})`);
});
