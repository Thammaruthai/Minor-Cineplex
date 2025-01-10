export default function handler(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // Ensure headers are sent immediately

  if (!global.sseClients) {
    global.sseClients = [];
  }

  // Add the client to the list of active clients
  global.sseClients.push(res);

  res.write(`data: {"status": "connected"}\n\n`);

  setInterval(() => {
    res.write(`data: {"status": "ping"}\n\n`);
  }, 10000);

  req.on("close", () => {
    console.log("Client disconnected");
    global.sseClients = global.sseClients.filter((client) => client !== res);
  });
}
