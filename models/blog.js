const { text } = require("body-parser");
const mongoose = require("mongoose");

//Schema för användare
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    text: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;