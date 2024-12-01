import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Query ดึงข้อมูลจาก movies และ reviews
      const result = await connectionPool.query(`
      SELECT 
    m.movie_id, 
    m.poster,
    m.title, 
    l.name AS language_name, 
    g.name AS genre_name, -- เพิ่มชื่อ genre
    r.rating, 
    m.release_date
FROM 
    movies m
INNER JOIN 
    languages l ON m.language_id = l.language_id
LEFT JOIN 
    movie_genres mg ON m.movie_id = mg.movie_id
LEFT JOIN 
    genres g ON mg.genre_id = g.genre_id -- เพิ่ม join กับ genres
LEFT JOIN 
    reviews r ON m.movie_id = r.movie_id
GROUP BY 
    m.movie_id, 
    m.title, 
    l.name, 
    g.name, -- เพิ่ม genre_name ใน GROUP BY
    r.rating, 
    m.release_date
ORDER BY 
    m.release_date ASC;

        
      `);
      res.status(200).json({ movies: result.rows });
    } catch (error) {
      console.error("Error fetching movies and reviews:", error.message);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
