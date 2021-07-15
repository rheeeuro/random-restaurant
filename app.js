// to check local node.js server
const express = require("express");
const app = express();

const PORT = 8080;

app.use("/css", express.static("./css"));
app.use("/js", express.static("./js"));
app.use("/img", express.static("./img"));

function handleListening() {
  console.log(`listening on: http://localhost:${PORT}`);
}

function handleHome(req, res) {
  res.sendFile(__dirname + "/index.html");
}
function handleSearch(req, res) {
  res.sendFile(__dirname + "/search.html");
}

app.get("/", handleHome);
app.get("/search", handleSearch);

app.listen(PORT, handleListening);
