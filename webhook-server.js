const http = require("http");
const { exec } = require("child_process");

const PORT = 9000;
const SECRET = "hotel-webhook-secret";

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/deploy") {
    res.writeHead(404);
    return res.end("Not found");
  }

  exec("/hotel-management-system/deploy.sh", (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      res.writeHead(500);
      return res.end("Deploy failed");
    }

    console.log(stdout);
    res.writeHead(200);
    res.end("Deploy started");
  });
});

server.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});
