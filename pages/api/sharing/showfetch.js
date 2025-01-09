import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  const bookingUUID = req.query.booking_uuid;

  try {
    // ดึงข้อมูลจาก token เพื่อใช้ในการดึงข้อมูล User
   
    const client = await connectionPool.connect();

    // Extract pagination params
    
    const query = `SELECT 
    b.booking_id,
    b.booking_date,
    b.total_price,
    b.booking_status,
    b.show_id,
    b.temp_booking_uuid,
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
WHERE b.temp_booking_uuid = $1 
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
    
`;

    const result = await client.query(query, [bookingUUID]);
    client.release();
    console.log(result.rows[0]);
;
    
    return res.status(200).json({ booking: result.rows[0] });
  } catch (error) {
    console.error("Error in confirm-booking API:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
}
