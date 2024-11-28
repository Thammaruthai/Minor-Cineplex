import { fetchFilteredShows } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { cinemaName = "" } = req.query;

  try {
    const shows = await fetchFilteredShows({ cinemaName });
    res.status(200).json({ data: shows });
  } catch (error) {
    console.error("Error fetching shows:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

// import { supabase } from "@/lib/supabaseClient";

// export default async function handler(req, res) {
//   try {
//     if (req.method === "GET") {
//       const { cinema, showtime } = req.query;

//       // Start building the query
//       let query = supabase
//         .from("shows")
//         .select(
//           `show_date_time,
//            halls (
//              name,
//              cinemas (
//                name,
//                city_id
//              )
//            )
//          `
//         );

//       // Apply filters conditionally
//       if (cinema) {
//         query = query.ilike("halls.cinemas.name", `%${cinema}%`);
//       }

//       if (showtime) {
//         query = query.eq("show_date_time", showtime);
//       }

//       // Execute the query
//       const { data, error } = await query;

//       console.log("Received query:", req.query);
//       console.log("Supabase data:", data);
//       console.log("Supabase error:", error);

//       if (error) {
//         return res.status(500).json({ message: error.message });
//       }

//       // Filter out entries where cinemas are null
//       const filteredData = data.filter((item) => item.halls?.cinemas);

//       if (!filteredData || filteredData.length === 0) {
//         return res
//           .status(404)
//           .json({ message: "No matching results found" });
//       }

//       // Format the filtered data
//       const formattedData = filteredData.map((item) => ({
//         showtime: item.show_date_time,
//         hallName: item.halls?.name || "Unknown",
//         cinemaName: item.halls?.cinemas?.name || "Unknown",
//         cityId: item.halls?.cinemas?.city_id || "Unknown",
//       }));

//       return res.status(200).json({
//         results: formattedData,
//       });
//     }
//   } catch (error) {
//     console.error("Error in API:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// }
