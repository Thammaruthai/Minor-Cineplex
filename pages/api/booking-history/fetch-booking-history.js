import connectionPool from "@/utils/db";
import jwt from "jsonwebtoken";
import protect from "@/utils/protect";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  protect(req, res, async () => {
    try {
      // ดึงข้อมูลจาก token เพื่อใช้ในการดึงข้อมูล User
      const token = req.headers.authorization?.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const { userId } = decoded;
      
      const client = await connectionPool.connect();

      // Extract pagination params
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 4;
      const offset = page * limit;
        console.log(offset);
        
      const userQuery = `
        SELECT * FROM users WHERE user_id = $1;
      `;
      const userResult = await client.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        client.release();
        return res.status(404).json({ error: "User not found." });
      }

      //select booking history
      //   const bookingListQuery = `
      //   SELECT b.booking_id, b.booking_date, b.total_price, b.booking_status, s.seat_row, s.seat_number, sh.show_date_time, m.title, m.poster, p.payment_date, p.payment_status, b.temp_booking_uuid, h.name as hall_name, c.name as cinema_name,p.payment_method
      //   FROM public.bookings b
      //   JOIN public.booking_seats bs ON bs.booking_id = b.booking_id
      //   JOIN public.seats s ON s.seat_id = bs.seat_id
      //   JOIN public.shows sh ON sh.show_id = b.show_id
      //   JOIN public.payments p ON p.booking_id = b.booking_id
      //   JOIN public.movies m ON m.movie_id = sh.movie_id
      //   JOIN public.halls h ON h.hall_id = sh.hall_id
      //   JOIN public.cinemas c ON c.cinema_id = h.cinema_id
      //   WHERE b.user_id = $1
      //   ORDER BY b.booking_id DESC;
      //   `;
      //   const bookingListResult = await client.query(bookingListQuery, [userId]);
      //   console.log(bookingListResult.rows.length);
      //   let booking_history = [];
      //   //grouping booking by booking_id and make seat as array
      //   for (let i = 0; i < bookingListResult.rows.length; i++) {
      //     let booking = bookingListResult.rows[i];
      //     let index = booking_history.findIndex((item) => item.booking_id === booking.booking_id);
      //     if (index === -1) {
      //       booking_history.push({
      //         booking_id: booking.booking_id,
      //         booking_date: booking.booking_date,
      //         total_price: booking.total_price,
      //         booking_status: booking.booking_status,
      //         show_date_time: booking.show_date_time,
      //         title: booking.title,
      //         poster: booking.poster,
      //         payment_date: booking.payment_date,
      //         payment_status: booking.payment_status,
      //         temp_booking_uuid: booking.temp_booking_uuid,
      //         cinemaName: booking.cinema_name,
      //         hallName: booking.hall_name,
      //         seats: [`${booking.seat_row}${booking.seat_number}`],
      //         paymentMethod: booking.payment_method
      //       });
      //     } else {
      //       booking_history[index].seats.push(
      //         `${booking.seat_row}${booking.seat_number}`
      //       );
      //     }
      //   }

      const query = `SELECT 
    b.booking_id,
    b.booking_date,
    b.total_price,
    b.booking_status,
    sh.show_date_time,
    m.title,
    m.poster,
    p.payment_date,
    p.payment_status,
    b.temp_booking_uuid,
    c.name as cinema_name,
    h.name as hall_name,
    p.payment_method,
     b.discount_applied,b.final_price,
     array_agg(s.seat_row || s.seat_number) AS seats 
    
FROM bookings b
JOIN booking_seats bs ON bs.booking_id = b.booking_id 
JOIN seats s ON s.seat_id = bs.seat_id
JOIN shows sh ON sh.show_id = b.show_id
LEFT JOIN payments p ON p.booking_id = b.booking_id
JOIN movies m ON m.movie_id = sh.movie_id
JOIN halls h ON h.hall_id = sh.hall_id
JOIN cinemas c ON c.cinema_id = h.cinema_id
WHERE b.user_id = $1 AND b.booking_status <> 'Cancelled'
GROUP BY 
    b.booking_id,
    b.booking_date,
    b.total_price,
    b.booking_status,
    sh.show_date_time,
    m.title,
    m.poster,
    p.payment_date,
    p.payment_status,
    b.temp_booking_uuid,
    c.name,
    h.name,
    p.payment_method
    
ORDER BY b.booking_id DESC
LIMIT $2 OFFSET $3;`;

      const result = await client.query(query, [userId, limit, offset]);
      client.release();

      console.log(result.rows);
      
      return res.status(200).json({ booking_history: result.rows });
    } catch (error) {
      console.error("Error in confirm-booking API:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
