import express from "express";
import path from "node:path";

const PORT = 3000;
const app = express();

let requestCount = 0;
let intervalId;

function resetRequestCount() {
  requestCount = 0;
}

function startTrackingRequestsPerSecond() {
  intervalId = setInterval(resetRequestCount, 1000);
}

function stopTrackingRequestsPerSecond() {
  clearInterval(intervalId);
}

app.use(express.static(path.resolve("public")));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  requestCount++;
  if (requestCount >= 50) {
    res.status(429).json({ error: "Rate limit exceeded" });
    return;
  }
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public") + "/index.html");
});

app.post("/api", (req, res) => {
  const delay = Math.floor(Math.random() * 1000) + 1;
  const { index } = req.query;

  if (index === "1001") {
    stopTrackingRequestsPerSecond();
  }

  setTimeout(() => {
    res.json({ index: index, delay: `${delay}ms` });
  }, delay);
});

startTrackingRequestsPerSecond();

app.listen(PORT, () => {
  console.log(`Server is running: http://localhost:${PORT}`);
});
