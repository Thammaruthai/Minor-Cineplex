import { viewMovie } from ".";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { movieId } = req.query;

    if (!movieId) {
      return res.status(400).json({
        message: `Movie ID is required`,
      });
    }
    try {
      const cinemas = await viewMovie(movieId);
      if (cinemas.length === 0) {
        return res.status(404).json({
          message: `No data found for the given movie ID`,
        });
      }
      return res.status(200).json({
        cinemas,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}
