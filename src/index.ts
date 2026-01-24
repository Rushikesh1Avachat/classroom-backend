// src/index.js
import('apminsight')
    .then(({ default: AgentAPI }) => AgentAPI.config())
    .catch(() => console.log('APM not available in this environment'));

import cors from "cors";
import express from "express";
import { toNodeHandler } from "better-auth/node";

import subjectsRouter from "./routes/subjects.js";
import usersRouter from "./routes/users.js";
import classesRouter from "./routes/classes.js";
import departmentsRouter from "./routes/departments.js";
import statsRouter from "./routes/stats.js";
import enrollmentsRouter from "./routes/enrollments.js";

import { auth } from "./lib/auth.js";

const app = express();

// ✅ Use environment PORT for Render/Vercel
const PORT = process.env.PORT || 8000;

// ✅ CORS setup
app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL!,        // local dev
            process.env.FRONTEND_VERCEL_URL!  // deployed frontend
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// ✅ Auth handler
app.all("/api/auth/*splat", toNodeHandler(auth));

// ✅ JSON body parsing
app.use(express.json());

// ✅ Routers
app.use("/api/subjects", subjectsRouter);
app.use("/api/users", usersRouter);
app.use("/api/classes", classesRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/enrollments", enrollmentsRouter);

// ✅ Test endpoint
app.get("/", (req, res) => {
    res.send("Backend server is running!");
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
