import connectionPool from "@/utils/db";
import cron from "node-cron";

const updateExpiredBookings = async () => {
  try {
    // Calculate cuurent time - 15 mins
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    // update booking_status in bookings
    const updateBookings = await connectionPool.query(
      `UPDATE bookings 
       SET booking_status = 'Cancelled' 
       WHERE booking_status = 'Active' AND booking_date < $1 
       RETURNING booking_id`,
      [fiveMinutesAgo.toISOString()]
    );

    // bring booking_id that updated
    const updatedBookingIds = updateBookings.rows.map((row) => row.booking_id);

    // update booking_seats that related
    if (updatedBookingIds.length > 0) {
      await connectionPool.query(
        `UPDATE booking_seats 
         SET status = 'Cancelled' 
         WHERE booking_id = ANY($1::int[])`,
        [updatedBookingIds]
      );
    }
  } catch (error) {
    console.error(`[CRON] Error updating bookings:`, error);
  }
};

cron.schedule("*/1 * * * *", updateExpiredBookings);

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    try {
      await updateExpiredBookings(); 
      return res.status(200).json({
        message: "Expired bookings cancelled successfully.",
      });
    } catch (error) {
      console.error("Error updating bookings:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
