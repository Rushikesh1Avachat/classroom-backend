import('apminsight')
    .then(({ default: AgentAPI }) => AgentAPI.config())
    .catch(() => console.log('APM not available in this environment'));

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";


import subjectsRouter from "./routes/subjects.js";
import usersRouter from "./routes/users.js";
import classesRouter from "./routes/classes.js";
import departmentsRouter from "./routes/departments.js";
import statsRouter from "./routes/stats.js";
import enrollmentsRouter from "./routes/enrollments.js";
import { auth } from "./lib/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// CORS setup: local dev + frontend Vercel URL
app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL!,            // Local frontend dev
            "https://classroom-frontend-8r4gervu1.vercel.app", // Vercel frontend
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());

// Auth routes
app.all("/api/auth/*splat", toNodeHandler(auth));

// Routers
app.use("/api/subjects", subjectsRouter);
app.use("/api/users", usersRouter);        // Users router handles register + login
app.use("/api/classes", classesRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/enrollments", enrollmentsRouter);

// Health check
app.get("/", (req, res) => {
    res.send("Backend server is running!");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
