import { supabase } from "@/lib/supabaseClient";

// export default async function handler(req, res) {
//   try {
//     if (req.method === "GET") {
//       const { cinema, showtime } = req.query || {};

//       console.log("Received cinema query:", cinema);
//       console.log("Received showtime query:", showtime);

//       let query = supabase
//         .from("shows")
//         .select(`show_date_time,halls (name, cinemas(name,city_id))`);
//       if (cinema) {
//         query = query.ilike("halls.cinemas.name", `%${cinema}`);
//       }
//       if (showtime) {
//         const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(showtime);
//         const isTimestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(showtime);

//         if (isDateOnly) {
//           // Filter for a specific date
//           const startOfDay = `${showtime}T00:00:00`;
//           const endOfDay = `${showtime}T23:59:59`;
//           query = query.gte("show_date_time", startOfDay).lte("show_date_time", endOfDay);
//         } else if (isTimestamp) {
//           // Filter for an exact timestamp
//           query = query.eq("show_date_time", showtime);
//         } else {
//           return res.status(400).json({ message: "Invalid showtime format." });
//         }
//       }
//       console.log("Query condition (cinema):", `%${cinema}%`);
//       console.log("Query condition (showtime):", `%${showtime}%`);

//       const { data, error } = await query;
//       console.log("Raw data from Supabase:", data);

//       if (error) {
//         console.log("Supabase error", error);
//         return res.status(500).json({ message: error.message });
//       }

//       const filteredData = data.filter((item) => item.halls?.cinemas);
//       console.log("Raw Supabase data:", data);
//       console.log("Filtered data:", filteredData);

//       if (!filteredData || filteredData.length === 0) {
//         return res
//           .status(404)
//           .json({ message: "No cinemas found for the selected movie" });
//       }

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
//     console.error("Error in searchCinemas API:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// }

export default async function handler(req, res) {
    try {
      if (req.method === "GET") {
        const { cinema, showtime } = req.query || {};
  
        console.log("Received cinema query:", cinema);
        console.log("Received showtime query:", showtime);
  
        let query = supabase
          .from("shows")
          .select(`show_date_time,halls (name, cinemas(name,city_id))`);
        if (cinema) {
          query = query.ilike("halls.cinemas.name", `%${cinema}`);
        }
        if (showtime) {
          const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(showtime);
          const isTimestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(showtime);
  
          if (isDateOnly) {
            // Filter for a specific date
            const startOfDay = `${showtime}T00:00:00`;
            const endOfDay = `${showtime}T23:59:59`;
            query = query.gte("show_date_time", startOfDay).lte("show_date_time", endOfDay);
          } else if (isTimestamp) {
            // Filter for an exact timestamp
            query = query.eq("show_date_time", showtime);
          } else {
            return res.status(400).json({ message: "Invalid showtime format." });
          }
        }
        console.log("Query condition (cinema):", `%${cinema}%`);
        console.log("Query condition (showtime):", `%${showtime}%`);
  
        const { data, error } = await query;
        console.log("Raw data from Supabase:", data);
  
        if (error) {
          console.log("Supabase error", error);
          return res.status(500).json({ message: error.message });
        }
  
        const filteredData = data.filter((item) => item.halls?.cinemas);
        console.log("Raw Supabase data:", data);
        console.log("Filtered data:", filteredData);
  
        if (!filteredData || filteredData.length === 0) {
          return res
            .status(404)
            .json({ message: "No cinemas found for the selected movie" });
        }
  
        const formattedData = filteredData.map((item) => ({
          showtime: item.show_date_time,
          hallName: item.halls?.name || "Unknown",
          cinemaName: item.halls?.cinemas?.name || "Unknown",
          cityId: item.halls?.cinemas?.city_id || "Unknown",
        }));
        return res.status(200).json({
          results: formattedData,
        });
      }
    } catch (error) {
      console.error("Error in searchCinemas API:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }