import { defineConfig } from "drizzle-kit";

export default defineConfig({
    // This tells Drizzle to look at every .ts file in the schema folder
    schema: "./src/db/schema/index.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});