// server.cjs
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// --- endpoint de salud ---
app.get("/healthz", (_req, res) => res.send("ok"));

// --- API principal ---
app.get("/api/test", (_req, res) => res.json({ msg: "Backend funcionando 🎉" }));

// --- servir frontend si existe carpeta dist ---
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));
app.get("/*", (req, res) => {
  try {
    res.sendFile(path.join(distPath, "index.html"));
  } catch {
    res.status(200).send("Backend OK");
  }
});

// --- arrancar servidor ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API escuchando en http://0.0.0.0:${PORT}`);
});
