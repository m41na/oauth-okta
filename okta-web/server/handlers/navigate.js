const path = require("path");

const landingPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist", "index.html"));
};

module.exports = {
  landingPage
};
