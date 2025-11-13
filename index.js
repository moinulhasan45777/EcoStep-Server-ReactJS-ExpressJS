const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const userChallengeCollection = db.collection("userChallenges");

    // ALL POST APIs
    app.post("/challenges", async (req, res) => {
      const newUserChallenge = req.body;
      const result = await challengesCollection.insertOne(newUserChallenge);
      res.send(result);
    });
    app.post("/challenges/join/:id", async (req, res) => {
      const newChallenge = req.body;
      const result = await userChallengeCollection.insertOne(newChallenge);
      res.send(result);
    });

    // All GET APIs
    app.get("/tips", async (req, res) => {
      const cursor = tipsCollection.find().sort({ createdAt: 1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/events", async (req, res) => {
      const cursor = eventsCollection.find().sort({ date: 1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/user-challenges", async (req, res) => {
      const cursor = userChallengeCollection.find();
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
      if (parseInt(req.query.participant) > 0) {
        query.participants = { $lte: parseInt(req.query.participant) };
        console.log(query);
      }

      const cursor = challengesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/challenges/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await challengesCollection.findOne(query);
      res.send(result);
    });

    // All PATCH APIs
    app.patch("/tips/:id", async (req, res) => {
      const id = req.params.id;
      const updatedTip = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          upvotes: updatedTip.upvotes,
        },
      };

      const options = {};
      const result = await tipsCollection.updateOne(query, update, options);
      res.send(result);
    });
    app.patch("/challenges/:id", async (req, res) => {
      const id = req.params.id;
      const updatedParticipants = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          participants: updatedParticipants.participants,
        },
      };
    });

    app.patch("/challenges/update/:id", async (req, res) => {
      const id = req.params.id;
      const updatedChallenge = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          title: updatedChallenge.title,
          category: updatedChallenge.category,
          description: updatedChallenge.description,
          duration: updatedChallenge.duration,
          target: updatedChallenge.target,
          participants: updatedChallenge.participants,
          impactMetric: updatedChallenge.impactMetric,
          createdBy: updatedChallenge.createdBy,
          startDate: updatedChallenge.startDate,
          endDate: updatedChallenge.endDate,
          imageUrl: updatedChallenge.imageUrl,
        },
      };

      const options = {};
      const result = await challengesCollection.updateOne(
        query,
        update,
        options
      );
      res.send(result);
    });

    // All DELETE APIs
    app.delete("/challenges/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await challengesCollection.deleteOne(query);
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
