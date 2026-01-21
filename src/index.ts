// File: src/server.ts
import express from "express";

const app = express();
const PORT=8000


// root route
app.get("/", (req, res) => {
    res.json({ message: "Hello Welcome to classroom API "});
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
