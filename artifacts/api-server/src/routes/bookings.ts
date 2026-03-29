import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable, servicesTable } from "@workspace/db/schema";
import { CreateBookingBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/bookings", async (req, res) => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid booking data" });
    return;
  }

  const { serviceId, name, email, phone, date, time, notes } = parsed.data;

  try {
    const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, serviceId));
    if (!service) {
      res.status(400).json({ error: "Service not found" });
      return;
    }

    const [booking] = await db
      .insert(bookingsTable)
      .values({
        serviceId,
        serviceName: service.name,
        name,
        email,
        phone,
        date,
        time,
        notes: notes ?? null,
        status: "pending",
      })
      .returning();

    res.status(201).json({
      ...booking,
      createdAt: booking.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create booking");
    res.status(500).json({ error: "Failed to create booking" });
  }
});

export default router;
