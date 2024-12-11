import { v4 as uuidv4 } from "uuid";

export default async function handler(req,res) {
    if (req.method === "POST") {
        try {
            const bookingId = uuidv4();
            
        } catch (error) {
            return res.status(500).json({
                error: error.message
            })
        }
    }
}