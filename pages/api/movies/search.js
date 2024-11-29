import connectionPool from "@/utils/db"; // Update with the correct path to your db.js file
import { fetchFilteredShows } from ".";// Update with the correct path to your utility file

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cinemaName, date } = req.query;

  if (!cinemaName && !date) {
    return res.status(400).json({ error: "At least one filter (cinemaName or date) is required" });
  }

  try {
    const shows = await fetchFilteredShows({ cinemaName, date });
    if (shows.length === 0) {
      return res.status(404).json({ message: "No shows found matching the filters" });
    }

    return res.status(200).json({ shows });
  } catch (error) {
    console.error("Error fetching filtered shows:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
