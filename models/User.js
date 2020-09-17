const mongoose = require('mongoose')

const { Schema, model } = mongoose

const usersSchema = new Schema(
  {
    picture: { type: String },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['basic', 'caretaker', 'admin'], default: 'basic' },
    pets: [{ type: mongoose.Types.ObjectId, ref: 'Pet' }],
    services: [{ type: String, enum: ['sitter', 'walker', 'trainer'] }],
    booked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Types.ObjectId, ref: 'User', default: null },
    rating: [{ type: mongoose.Types.ObjectId, ref: 'UserRating' }],
    blogs: [{ type: mongoose.Types.ObjectId, ref: 'Blog' }],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  { timestamps: true }
)

usersSchema.index({ location: '2dsphere' })

const User = model('User', usersSchema)
module.exports = User
