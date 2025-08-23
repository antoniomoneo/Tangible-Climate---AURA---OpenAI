// server.cjs (mínimo para validar puerto)
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.get("/healthz", (_req, res) => res.send("ok"));
app.get("/", (_req, res) => res.send("hello from backend"));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});
