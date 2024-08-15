const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ioio.mongodb.net/?retryWrites=true&w=majority`;

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

    // All-collection
    const allProducts = client.db("LubaBeauty").collection("products");

    // all routes

    app.get("/products", async (req, res) => {
      const result = await allProducts.find().toArray();
      res.json(result);
    });

    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

// Call the run function but do not close the connection
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Luba Beauty!");
});

app.listen(port, () => {
  console.log(`LubaBeauty Server is running on port: ${port}`);
});
