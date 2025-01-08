export default function handler(req, res) {
    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
  
    res.flushHeaders(); // Ensure headers are sent immediately
  
    // Initialize the global array for SSE clients if it doesn't exist
    if (!global.sseClients) {
      global.sseClients = [];
    }
  
    // Add the client to the list of active clients
    global.sseClients.push(res);
  
    // Send initial connection message
    res.write(`data: {"status": "connected"}\n\n`);
  
    // Remove the client when connection is closed
    req.on("close", () => {
      console.log("Client disconnected");
      global.sseClients = global.sseClients.filter(client => client !== res);
    });
  }
  