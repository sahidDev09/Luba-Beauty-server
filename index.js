const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Luba Beauty!");
});

app.listen(port, () => {
  console.log(`LubaBeauty Server is running in port:${port}`);
});
