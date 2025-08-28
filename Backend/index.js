import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import lowStockScheduler from "./utils/lowStockScheduler.js";

dotenv.config({
    path: "./.env",
});

app.get("/", (req, res) => {
    res.json({
        message: "Hello World !!",
        status: "Backend is running",
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || "development",
    });
});

app.get("/api/v1/test", (req, res) => {
    res.json({
        message: "API routes are working!",
        endpoint: "/api/v1/test",
        timestamp: new Date().toISOString()
    });
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(
                `✅ Server listening on http://localhost:${process.env.PORT}/`
            );

            // Start the low stock alert scheduler after server starts
            console.log("🚀 Starting low stock alert scheduler...");
            lowStockScheduler.start();
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!! ", err);
    });

// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("🛑 SIGTERM received, stopping low stock scheduler...");
    lowStockScheduler.stop();
    process.exit(0);
});

process.on("SIGINT", () => {
    console.log("🛑 SIGINT received, stopping low stock scheduler...");
    lowStockScheduler.stop();
    process.exit(0);
});
