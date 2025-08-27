import cron from "node-cron";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import transporter from "./nodemailer.js";
import { ApiError } from "./ApiError.js";

class LowStockScheduler {
    constructor() {
        this.threshold = 10;
        this.isRunning = false;
    }

    // Method to send low stock alerts for a specific user
    async sendUserLowStockAlert(userId, userEmail, username) {
        try {
            const lowStockProducts = await Product.find({
                created_by: userId,
                stock: { $lt: this.threshold },
            })
                .select(
                    "product_name product_code stock buying_price selling_price"
                )
                .populate("category_id", "category_name")
                .sort({ stock: 1 });

            if (lowStockProducts.length === 0) {
                console.log(
                    `No low stock products found for user: ${username}`
                );
                return { sent: false, reason: "no_low_stock", count: 0 };
            }

            const productsTable = lowStockProducts
                .map((product, index) => {
                    const backgroundColor =
                        index % 2 === 0 ? "#ffffff" : "#f8fafc";
                    return `
                        <tr style="background-color: ${backgroundColor};">
                            <td style="padding: 14px 16px; color: #1e293b; font-weight: 600; font-size: 15px;">${product.product_name}</td>
                            <td style="padding: 14px 16px; color: #475569; font-family: monospace;">${product.product_code}</td>
                            <td style="padding: 14px 16px;">
                                <span style="background-color: #fee2e2; color: #b91c1c; font-weight: 700; padding: 4px 10px; border-radius: 9999px; font-size: 14px;">
                                    ${product.stock}
                                </span>
                            </td>
                            <td style="padding: 14px 16px; color: #475569;">${product.category_id?.category_name || "N/A"}</td>
                        </tr>
                    `;
                })
                .join("");

            const mailOptions = {
                from: `InventoryPro <${process.env.SENDER_EMAIL}>`,
                to: userEmail,
                subject: "🚨 Weekly Low Stock Alert - Action Required",
                html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Weekly Low Stock Alert</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f8fa;">
                    <span style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
                        Your weekly inventory report: ${lowStockProducts.length} products need restocking.
                    </span>

                    <div style="max-width: 640px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
                        <div style="padding: 32px;">
                            <h1 style="font-size: 28px; font-weight: 800; color: #111827; margin: 0 0 4px 0;">
                                📊 Weekly Low Stock Report
                            </h1>
                            <p style="font-size: 16px; color: #4b5563; margin: 0 0 24px 0;">
                                Your automated weekly inventory alert
                            </p>

                            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 24px;">
                                Hello <strong>${username}</strong>, here's your weekly low stock report. The following <strong>${lowStockProducts.length}</strong> products have fallen below the stock threshold of ${this.threshold} units:
                            </p>

                            <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                                    <thead>
                                        <tr style="background-color: #f9fafb;">
                                            <th style="padding: 12px 16px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                                            <th style="padding: 12px 16px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Code</th>
                                            <th style="padding: 12px 16px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Stock Left</th>
                                            <th style="padding: 12px 16px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Category</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${productsTable}
                                    </tbody>
                                </table>
                            </div>

                            <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin: 24px 0;">
                                <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
                                    💡 <strong>Tip:</strong> Take action now to prevent potential sales disruptions and ensure customer satisfaction.
                                </p>
                            </div>

                            <p style="text-align: center; margin: 32px 0;">
                                <a href="${process.env.FRONTEND_URL}/products" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; background-color: #3b82f6; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    Restock Items Now
                                </a>
                            </p>
                        </div>

                        <div style="padding: 24px; background-color: #f8fafc; border-top: 1px solid #e5e7eb; text-align: center;">
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">
                                This is an automated weekly report sent every Monday at 9:00 AM.
                            </p>
                            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                                &copy; ${new Date().getFullYear()} InventoryPro. All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            };

            await transporter.sendMail(mailOptions);
            console.log(
                `Low stock alert sent to ${username} (${userEmail}) - ${lowStockProducts.length} products`
            );

            return {
                sent: true,
                count: lowStockProducts.length,
                email: userEmail,
                username: username,
            };
        } catch (error) {
            console.error(
                `Error sending low stock alert to ${username}:`,
                error
            );
            return {
                sent: false,
                reason: "email_error",
                error: error.message,
                email: userEmail,
                username: username,
            };
        }
    }

    // Method to send alerts to all users
    async sendAllUsersLowStockAlerts() {
        try {
            console.log("🔄 Starting weekly low stock alert process...");

            // Get all users with email addresses
            const users = await User.find({
                email: { $exists: true, $ne: null, $ne: "" },
            }).select("_id username email role");

            if (users.length === 0) {
                console.log("❌ No users with email addresses found");
                return { success: false, message: "No users with email found" };
            }

            const results = {
                total: users.length,
                sent: 0,
                failed: 0,
                noLowStock: 0,
                details: [],
            };

            // Process each user
            for (const user of users) {
                const result = await this.sendUserLowStockAlert(
                    user._id,
                    user.email,
                    user.username
                );

                results.details.push({
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    ...result,
                });

                if (result.sent) {
                    results.sent++;
                } else if (result.reason === "no_low_stock") {
                    results.noLowStock++;
                } else {
                    results.failed++;
                }

                // Add small delay between emails to avoid overwhelming the email service
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            console.log(`✅ Low stock alert process completed:
                📧 Sent: ${results.sent}
                ✅ No low stock: ${results.noLowStock}
                ❌ Failed: ${results.failed}
                📊 Total users: ${results.total}`);

            return { success: true, results };
        } catch (error) {
            console.error("❌ Error in low stock alert process:", error);
            return { success: false, error: error.message };
        }
    }

    // Start the cron job
    start() {
        if (this.isRunning) {
            console.log("⚠️ Low stock scheduler is already running");
            return;
        }

        // Schedule to run every Monday at 9:00 AM
        // Format: second minute hour day month dayOfWeek
        this.cronJob = cron.schedule(
            "0 0 9 * * 1",
            async () => {
                console.log("⏰ Weekly low stock alert cron job triggered");
                await this.sendAllUsersLowStockAlerts();
            },
            {
                scheduled: false,
                timezone: process.env.TIMEZONE || "Asia/Kolkata", // Adjust according to your timezone
            }
        );

        this.cronJob.start();
        this.isRunning = true;

        console.log(
            "🚀 Low stock alert scheduler started - will run every Monday at 9:00 AM"
        );
    }

    // Stop the cron job
    stop() {
        if (this.cronJob) {
            this.cronJob.stop();
            this.isRunning = false;
            console.log("⏸️ Low stock alert scheduler stopped");
        }
    }

    // Manual trigger for testing
    async triggerManually() {
        console.log("🧪 Manually triggering low stock alerts for testing...");
        return await this.sendAllUsersLowStockAlerts();
    }

    // Update threshold
    setThreshold(newThreshold) {
        this.threshold = newThreshold;
        console.log(`📊 Low stock threshold updated to: ${this.threshold}`);
    }

    // Get status
    getStatus() {
        return {
            isRunning: this.isRunning,
            threshold: this.threshold,
            nextRun: this.cronJob ? this.cronJob.nextDate() : null,
        };
    }
}

// Create singleton instance
const lowStockScheduler = new LowStockScheduler();

export default lowStockScheduler;
