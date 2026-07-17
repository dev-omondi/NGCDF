import cron from "node-cron";
import Applications from "../models/applicationSchema.js";

console.log("Applicant cron started...");
cron.schedule("* * * * *", async () => {
  try {
    console.log("Checking applications...");

    const now = new Date();

    const cutoff = new Date(now.getTime() - 50* 60 * 1000);

    const result = await Applications.updateMany(
      {
        status: "Under-Review",
        reviewStartedAt: { $lte: cutoff },
      },
      {
        $set: {
          status: "Pending",
          reviewStartedAt: null,
        },
      }
    );

  } catch (err) {
    console.log("Cron error:", err.message);
  }
});