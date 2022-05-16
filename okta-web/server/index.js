const express = require("express");
const timeout = require("connect-timeout");
// const session = require('cookie-session');
const path = require("path");
const cors = require("cors");
const http = require("http");
const morgan = require("morgan");
const dotenv = require('dotenv');
var crypto = require('crypto');

const router = require("./routes");

dotenv.config({ path: '.env.development.local' });
const app = express();

const port = process.env.PORT || 5000; // default port is 5000
const timeOut = process.env.TIME_OUT || 120000;

// initialize application
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(timeout(timeOut));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../dist")));
// app.use(session({
//   name: "session",
//   secret: crypto.randomBytes(32).toString('hex'),
//   maxAge: 1000 * 60 * 60 * 24, //1 day
//   httpOnly: true
// }));
app.use(router);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Express is listening on port ${port}.`);
});
