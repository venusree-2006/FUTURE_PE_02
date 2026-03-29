import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactsTable } from "@workspace/db/schema";
import { SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid contact data" });
    return;
  }

  const { name, email, phone, message } = parsed.data;

  try {
    const [contact] = await db
      .insert(contactsTable)
      .values({
        name,
        email,
        phone: phone ?? null,
        message,
      })
      .returning();

    res.status(201).json({
      id: contact.id,
      message: "Thank you for reaching out! We will get back to you soon.",
    });
  } catch (err) {
    req.log.error({ err }, "Failed to submit contact");
    res.status(500).json({ error: "Failed to submit contact" });
  }
});

export default router;
