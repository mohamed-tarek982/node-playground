const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("<h1>This is the test pages</h1>");
});

app.use((req, res, next) => {
  res.send("<h1>This for General pages</h1>");
});

// app.use((req, res, next) => {
//   console.log(`URL is: ${req.url}`);
//   next();
// });

// app.get("/", (req, res) => {
//   res.send("<h1>Hello, Worlddd!</h1>");
// });

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
