import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

mongoose.pluralize(null);

const schema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Please add name"],
  },
  last_name: {
    type: String,
    required: [true, "Please add last name"],
  },
  email: {
    type: String,
    required: [true, "Please add email"],
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    require: [true, "Please add password"],
    minlength: 6,
    select: false,
  },
  age: {
    type: Number,
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password
schema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
});

// Sign JWT and return
schema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Math user entered password to hashed password in database
schema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const UserAuth = mongoose.model('usersAuth', schema)

export default UserAuth