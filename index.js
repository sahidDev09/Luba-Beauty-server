const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8000;

app.use(express.json());

const middleOption = {
  origin: ["http://localhost:5173", "https://lubabeauty-8277b.web.app"],
  credentials: true,
  optionSuccessStatus: 204,
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
    // await client.connect();
    console.log("Connected to MongoDB successfully!");

    // Collection reference
    const allProducts = client.db("LubaBeauty").collection("products");
    const homeProducts = client.db("LubaBeauty").collection("homeProducts");

    // Products route with search and category filter
    app.get("/products", async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1; // Current page number (default: 1)
        const limit = parseInt(req.query.limit) || 6; // Number of products per page (default: 6)
        const searchQuery = req.query.search || ""; // Search query
        const category = req.query.category || "all"; // Category filter
        const brand = req.query.brand || "all";

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Create a search filter
        const searchFilter = {
          ...(searchQuery && {
            Product_Name: { $regex: searchQuery, $options: "i" },
          }),
          ...(category !== "all" && { Category: category }),
          ...(brand !== "all" && { Brand: brand }),
        };

        // Fetch products with pagination and search filter
        const result = await allProducts
          .find(searchFilter)
          .skip(skip)
          .limit(limit)
          .toArray();

        // Count the total number of documents matching the search filter
        const totalProducts = await allProducts.countDocuments(searchFilter);

        // Send paginated response with product data and metadata
        res.json({
          totalProducts,
          totalPages: Math.ceil(totalProducts / limit),
          currentPage: page,
          products: result,
        });
      } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    //api for home page

    app.get("/homeProducts", async (req, res) => {
      const result = await homeProducts.find().toArray();
      res.json(result);
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
