const express = require("express");
const { createClient } = require("redis");
const fivebeans = require("fivebeans");

const app = express();
const PORT = 3000;

// Redis Clients
const redisRdb = createClient({ url: "redis://redis_rdb:6379" });
const redisAof = createClient({ url: "redis://redis_aof:6379" });

// Beanstalkd Client
const beanstalkd = new fivebeans.client("beanstalkd", 11300);

(async () => {
  await redisRdb.connect();
  await redisAof.connect();
  console.log("Connected to Redis");

  beanstalkd
    .on("connect", () => console.log("Connected to Beanstalkd"))
    .on("error", (err) => console.error("Beanstalkd error:", err))
    .connect();
})();

app.use(express.json());

// Add message to queue
app.post("/enqueue", async (req, res) => {
  const { queue, message } = req.body;

  if (!queue || !message) {
    return res.status(400).json({ error: "Queue and message are required" });
  }

  try {
    if (queue === "redisRdb") await redisRdb.lPush("queue:rdb", message);
    else if (queue === "redisAof") await redisAof.lPush("queue:aof", message);
    else if (queue === "beanstalkd") {
      beanstalkd.put(0, 0, 60, message, (err, jobId) => {
        if (err) return res.status(500).json({ error: "Beanstalkd error" });
        return res.json({ status: "Message added", jobId });
      });
      return;
    } else {
      return res.status(400).json({ error: "Invalid queue type" });
    }

    res.json({ status: "Message added" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get message from queue
app.get("/dequeue", async (req, res) => {
  const { queue } = req.query;

  if (!queue) {
    return res.status(400).json({ error: "Queue is required" });
  }

  try {
    if (queue === "redisRdb") {
      const message = await redisRdb.rPop("queue:rdb");
      return res.json({ message });
    }
    if (queue === "redisAof") {
      const message = await redisAof.rPop("queue:aof");
      return res.json({ message });
    }
    if (queue === "beanstalkd") {
      beanstalkd.reserve((err, jobId, payload) => {
        if (err) return res.json({ message: "No tasks available" });
        beanstalkd.destroy(jobId, () => {});
        return res.json({ message: payload });
      });
      return;
    }
    return res.status(400).json({ error: "Invalid queue type" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
