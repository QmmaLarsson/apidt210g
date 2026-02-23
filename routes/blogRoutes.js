const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Anslut till MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Ansluten till MongoDB");
}).catch((error) => {
    console.error("Error vid anslutning till MongoDB: " + error)
});

//Blog-model
const Blog = require("../models/blog");

//Hämta inlägg
router.get("/blog", async (req, res) => {
    try {
        // Hämta data från databasen
        const blog = await Blog.find({});

        // Skicka data tillbaka till klienten
        res.json(blog);
    } catch (error) {
        // Hantera eventuella fel
        console.error("Det uppstod ett fel vid hämtning av data:", error);
        res.status(500).json({ message: "Det uppstod ett fel vid hämtning av data." });
    }
});

//Posta nytt inlägg
router.post("/blog", authenticateToken, async (req, res) => {
    try {
        const { title, text } = req.body;

        //Validera input
        if (!title || !text) {
            return res.status(400).json({ error: "Ogiltig inmatning, vänligen fyll i alla fält" });
        }

        //Korrekt input - Skapa nytt inlägg
        const newItem = new Blog({ title, text });
        await newItem.save();
        res.status(201).json({ message: "Nytt inlägg skapat" });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//Ta bort inlägg
router.delete("/blog/:id", authenticateToken, async (req, res) => {
    try {
        const itemId = req.params.id;

        const result = await Blog.findByIdAndDelete(itemId);

        return res.json(result);
    } catch (error) {
        //Errorhantering
        return res.status(500).json({ message: "Det uppstod ett fel vid borttagning av inlägg", error: error });
    }
});

//Uppdatera inlägg
router.put("/blog/:id", authenticateToken, async (req, res) => {
    try {
        const itemId = req.params.id;
        const updatedItem = req.body;

        const result = await Blog.findByIdAndUpdate(itemId, updatedItem, { new: true });

        return res.json(result);
    } catch (error) {
        //Errorhantering
        return res.status(500).json({ message: "Det uppstod ett fel vid uppdatering av inlägg.", error: error });
    }
});

//Validering av token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) res.status(401).json({ message: "Token saknas - du har ej tillgång till denna route" });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if (err) return res.status(403).json({ message: "Felaktigt JWT-token" });
        req.username = username;
        next();
    });
}


module.exports = router;