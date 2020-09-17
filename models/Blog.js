const mongoose = require('mongoose')

const { Schema, model } = mongoose

const blogSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    picture: { type: String },
    date: { type: Date, default: Date.now },
    title: { type: String, required: true },
    description: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

const Blog = model('Blog', blogSchema)

module.exports = Blog
