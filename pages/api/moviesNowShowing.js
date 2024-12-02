// import connectionPool from "@/utils/db";

// export default async function handler(req, res) {
//   if (req.method === "GET") {
//     try {
//       // Query ดึงข้อมูล movies และ reviews
//       const result = await connectionPool.query(`
//         SELECT
//           m.movie_id,
//           m.poster,
//           m.title,
//           STRING_AGG(DISTINCT g.name, ', ') AS genre_names,
//           STRING_AGG(DISTINCT l.name, ', ') AS language_names,
//           ROUND(AVG(r.rating), 1) AS avg_rating,
//           m.release_date
//         FROM movies m
//         LEFT JOIN movie_genres mg ON m.movie_id = mg.movie_id
//         LEFT JOIN genres g ON mg.genre_id = g.genre_id
//         LEFT JOIN reviews r ON m.movie_id = r.movie_id
//         LEFT JOIN languages l ON m.language_id = l.language_id
//         GROUP BY m.movie_id
//         ORDER BY m.release_date ASC;
//       `);

//       res.status(200).json({ movies: result.rows });
//     } catch (error) {
//       console.error("Error fetching movies and reviews:", error.message);
//       res.status(500).json({ error: "Failed to fetch data" });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }
