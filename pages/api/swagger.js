// pages/api/swagger.js
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../../swagger.json"; // path ไปยังไฟล์ swagger.json

export default function handler(req, res) {
  if (req.method === "GET") {
    swaggerUi.setup(swaggerDocument);
    return res.redirect("/api-docs");
  }
}
