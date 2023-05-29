const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const leadCollections = client.db("leadGeneration").collection("lead");
    const categoryCollections = client
      .db("leadGeneration")
      .collection("category");
    const profileCollections = client
      .db("leadGeneration")
      .collection("profile");
    const leadtakenCollections = client
      .db("leadGeneration")
      .collection("leadtaken");
    const buycreditCollections = client
      .db("leadGeneration")
      .collection("buycredit");
    const listnameCollections = client
      .db("leadGeneration")
      .collection("listname");

    app.post("/add-lead", async (req, res) => {
      const lead = req.body;
      const result = await leadCollections.insertOne(lead);
      res.send(result);
    });

    app.get("/leads", async (req, res) => {
      const query = {};
      const cursor = leadCollections.find(query);
      const leads = await cursor.toArray();
      res.send(leads);
    });

    app.get("/lead/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const lead = await leadCollections.findOne(query);
        res.send(lead);
      } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
      }
    });

    app.put("/lead/:id", async (req, res) => {
      const id = req.params.id;
      const leadTaken = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          leadStatus: leadTaken.leadStatus,
          clientId: leadTaken.clientId,
          leadTakenBy: leadTaken.leadTakenBy,
          availableCredit: leadTaken.availableCredit,
          listName: leadTaken.listName,
        },
      };

      const result = await leadCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /***
     * List Name
     * **/

    app.post("/create-list", async (req, res) => {
      const list = req.body;
      const result = await listnameCollections.insertOne(list);
      res.send(result);
    });

    app.get("/lists", async (req, res) => {
      const query = {};
      const cursor = listnameCollections.find(query);
      const lists = await cursor.toArray();
      res.send(lists);
    });

    app.get("/list/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const list = await listnameCollections.findOne(query);
        res.send(list);
      } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
      }
    });

    app.put("/list/:id", async (req, res) => {
      const id = req.params.id;
      const list = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          leadStatus: leadTaken.leadStatus,
          clientId: leadTaken.clientId,
          leadTakenBy: leadTaken.leadTakenBy,
          availableCredit: leadTaken.availableCredit,
        },
      };

      const result = await listnameCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /***
     * Credit Setup
     * **/

    app.post("/add-credit-package", async (req, res) => {
      const creditPackage = req.body;
      const result = await buycreditCollections.insertOne(creditPackage);
      res.send(result);
    });

    app.get("/credit-packages", async (req, res) => {
      const query = {};
      const cursor = buycreditCollections.find(query);
      const creditPackages = await cursor.toArray();
      res.send(creditPackages);
    });

    app.get("/credit-package/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const creditPackage = await buycreditCollections.findOne(query);
        res.send(creditPackage);
      } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
      }
    });

    app.put("/credit-package/:id", async (req, res) => {
      const id = req.params.id;
      const creditPackage = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          leadStatus: leadTaken.leadStatus,
          clientId: leadTaken.clientId,
          leadTakenBy: leadTaken.leadTakenBy,
          availableCredit: leadTaken.availableCredit,
        },
      };

      const result = await buycreditCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /***
     * Lead Taken
     * **/

    app.post("/lead-taken", async (req, res) => {
      const leadTaken = req.body;
      const result = await leadtakenCollections.insertOne(leadTaken);
      res.send(result);
    });

    app.get("/leads-taken", async (req, res) => {
      const query = {};
      const cursor = leadtakenCollections.find(query);
      const leads = await cursor.toArray();
      res.send(leads);

      app.get("/taken", async (req, res) => {
        const email = req.query.leadTakenBy;
        const query = { leadTakenBy: email };
        const cursor = leadCollections.find(query);
        const leadTaken = await cursor.toArray();
        res.send(leadTaken);
      });
    });

    /***
     * Lead Category
     * **/
    app.post("/add-category", async (req, res) => {
      const category = req.body;
      const result = await categoryCollections.insertOne(category);
      res.send(result);
    });

    app.get("/categories", async (req, res) => {
      const query = {};
      const cursor = categoryCollections.find(query);
      const categories = await cursor.toArray();
      res.send(categories);
    });

    app.get("/category/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const category = await categoryCollections.findOne(query);
        res.send(category);
      } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
      }
    });

    app.put("/category/:id", async (req, res) => {
      const id = req.params.id;
      const updateLead = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          leadName: updateLead.leadName,
        },
      };

      const result = await categoryCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /**
     * Customer Profile
     * ***/

    app.post("/add-profile", async (req, res) => {
      const profile = req.body;
      const result = await profileCollections.insertOne(profile);
      res.send(result);
    });

    app.get("/profiles", async (req, res) => {
      const query = {};
      const cursor = profileCollections.find(query);
      const profiles = await cursor.toArray();
      res.send(profiles);
    });

    app.get("/profile", async (req, res) => {
      const email = req.query.customerEmail;
      const query = { customerEmail: email };
      const cursor = profileCollections.find(query);
      const clientprofile = await cursor.toArray();
      res.send(clientprofile);
    });

    app.get("/profile/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const profile = await profileCollections.findOne(query);
        res.send(profile);
      } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
      }
    });

    app.put("/profile/:id", async (req, res) => {
      const id = req.params.id;
      const updateCredit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          credit: updateCredit.credit,
        },
      };

      const result = await profileCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Lead Generation");
});

app.listen(port, () => {
  console.log(`Lead App ${port}`);
});
