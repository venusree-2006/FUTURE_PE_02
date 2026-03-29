import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { servicesTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/services", async (req, res) => {
  try {
    const services = await db.select().from(servicesTable).orderBy(servicesTable.category, servicesTable.name);
    res.json(services);
  } catch (err) {
    req.log.error({ err }, "Failed to get services");
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

export default router;
