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
    console.error("Error vid anslutning till MongoDB:" + error)
});

//Användar-model
const User = require("../models/user");

//Lägg till ny användare
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        //Validera input
        if (!username || !password) {
            return res.status(400).json({ error: "Ogiltig inmatning, fyll i användarnamn och lösenord" });
        }

        if (username.length < 4) {
            return res.status(400).json({ error: "Användarnamn måste bestå av minst fyra tecken" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Lösenord måste bestå av minst sex tecken" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Användarnamnet är upptaget" });
        }

        //Korrekt input - Skapa användare
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: "Användare skapad" });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//Logga in användare
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        //Validera input
        if (!username || !password) {
            return res.status(400).json({ error: "Ogiltig inmatning, fyll i användarnamn och lösenord" });
        }

        //Kontrollera username och password
        //Kontrollera om användaren finns
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Felaktigt användarnamn eller lösenord" });
        }
        //Kontrollera lösenord
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Felaktigt användarnamn eller lösenord" });
        } else {
            const payload = { username: username };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "3h" });

            res.status(200).json({
                message: "Inloggningen lyckades",
                user: {
                    _id: user._id,
                    username: user.username
                },
                token: token
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;