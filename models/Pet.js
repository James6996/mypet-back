const mongoose = require('mongoose')

const { Schema, model } = mongoose

const petSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    picture: { type: String, default: null },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    type: { type: String },
    race: { type: String },
    gender: { type: String, required: true },
    description: { type: String, required: false },
  },
  { timestamps: true }
)

const Pet = model('Pet', petSchema)

module.exports = Pet
