import Cors from "cors";

// สร้าง middleware สำหรับ CORS
const cors = Cors({
  methods: ["GET", "POST"],
  origin: "https://your-production-domain.com", // กำหนด origin ที่อนุญาตให้เข้าถึง API ของคุณ
});

// ใช้งาน CORS middleware
function runCors(req, res, next) {
  cors(req, res, (result) => {
    if (result instanceof Error) {
      return res.status(500).json({ error: result.message });
    }
    next();
  });
}

export default async function handler(req, res) {
  // เรียกใช้งาน CORS middleware
  await runCors(req, res, () => {
    // ตั้งค่า headers สำหรับ SSE
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
      global.sseClients = global.sseClients.filter((client) => client !== res);
    });
  });
}
