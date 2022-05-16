const express = require("express");
const timeout = require("connect-timeout");
const path = require("path");
const cors = require("cors");
const http = require("http");
const morgan = require("morgan");
const router = require("./routes");

const app = express();

const port = process.env.PORT || 5000; // default port is 5000
const timeOut = process.env.TIME_OUT || 120000;

// initialize application
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(timeout(timeOut));
app.use('/api', router);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Jwt API server is listening on port ${port}.`);
});
