const { createServer } = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(PORT, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`🚀 Ready on port ${PORT}`);
  });
});
