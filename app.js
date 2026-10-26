const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/test" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(`
      <form action="/message" method="POST">
        <input type="text" name="message">
        <button type="submit">Send</button>
      </form>
    `);
  }

  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const message = Buffer.concat(body).toString();
      const parsedMessage = message.split("=")[1];
      fs.writeFileSync("message.txt", parsedMessage);
    });
      res.statusCode = 302;
      res.setHeader("Location", "/test");
      return res.end();
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
