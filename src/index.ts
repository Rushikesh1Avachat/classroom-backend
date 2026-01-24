import("apminsight")
    .then(({ default: AgentAPI }) => AgentAPI.config())
    .catch(() => console.log("APM not available in this environment"));

import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import subjectsRouter from "./routes/subjects.js";
import usersRouter from "./routes/users.js";
import classesRouter from "./routes/classes.js";
import departmentsRouter from "./routes/departments.js";
import statsRouter from "./routes/stats.js";
import enrollmentsRouter from "./routes/enrollments.js";

import { auth } from "./lib/auth.js";

const app = express();
const PORT = process.env.PORT || 8000;

/* =========================
   ✅ CORS CONFIGURATION
========================= */
const allowedOrigins = [
    "http://localhost:5173",
    "https://classroom-frontend-hdgpikxlw.vercel.app",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

// Safe preflight handling for all API routes
app.options("/api/:path(*)", cors());

/* =========================
   ✅ BODY PARSER
========================= */
app.use(express.json());

/* =========================
   ✅ AUTH ROUTE
========================= */
app.all("/api/auth/*", toNodeHandler(auth));

/* =========================
   ✅ API ROUTES
========================= */
app.use("/api/subjects", subjectsRouter);
app.use("/api/users", usersRouter);
app.use("/api/classes", classesRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/enrollments", enrollmentsRouter);

/* =========================
   ✅ HEALTH CHECK
========================= */
app.get("/", (_req, res) => {
    res.send("Backend server is running!");
});

/* =========================
   ✅ START SERVER
========================= */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
