const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjo91.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("emaJohn").collection("product");

    app.get("/product", async (req, res) => {
      const productPerPage = parseInt(req.query.productPerPage);
      const activePage = parseInt(req.query.activePage);

      const query = {};
      const cursor = productCollection.find(query);

      let products;
      if (productPerPage || activePage) {
        products = await cursor
          .skip(productPerPage * activePage)
          .limit(productPerPage)
          .toArray();
      } else {
        products = await cursor.toArray();
      }
      res.send(products);
    });

    app.get("/productCount", async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log("Listening to port ", port);
});
