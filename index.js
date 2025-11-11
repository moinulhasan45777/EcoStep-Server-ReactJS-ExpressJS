const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://moinul45777:qxl22HBK0kFl0RUp@moinul.ciuiphx.mongodb.net/?appName=Moinul";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("eco-step_db");

    // Collections -------------------
    const tipsCollection = db.collection("tips");
    const eventsCollection = db.collection("events");
    const challengesCollection = db.collection("challenges");

    app.get("/tips", async (req, res) => {
      const cursor = tipsCollection.find().limit(3);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/events", async (req, res) => {
      const cursor = eventsCollection.find().limit(3);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/challenges", async (req, res) => {
      const query = {};

      if (req.query.category) {
        query.category = { $in: [req.query.category] };
      }
      if (req.query.startDate) {
        query.startDate = { $gte: req.query.startDate };
      }
      if (req.query.endDate) {
        query.endDate = { $lte: req.query.endDate };
      }
      if (req.query.participants) {
        query.participants.$gte = { $gte: 0 };
        query.participants.$lte = { $lte: parseInt(req.query.participants) };
      }

      const cursor = challengesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
