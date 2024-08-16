const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8000;

app.use(express.json());

const middleOption = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 204, // Changed to 204 as it's the standard for preflight responses
};
app.use(cors(middleOption));

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
    console.log("Connected to MongoDB successfully!");

    // All-collection
    const allProducts = client.db("LubaBeauty").collection("products");

    // All routes
    app.get("/products", async (req, res) => {
      try {
        const result = await allProducts.find().toArray();
        res.json(result);
      } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Internal Server Error");
      }
    });
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
