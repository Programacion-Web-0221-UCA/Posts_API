const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const { ROLES } = require("@app/constants");

const crypto = require('crypto');
const generatePassword = require("password-generator");


const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    required: true,
    enum: ROLES.ENUM,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  favorites: {
    type: [{
      type: Mongoose.Types.ObjectId,
      ref: "Post"
    }],
    default: []
  },
  salt: String,
  validTokens: [String],
}, {
  timestamps: true
});

userSchema.methods = {
  comparePassword: function (input) {
      return this.encryptPassword(input) === this.hashedPassword;
  },
  encryptPassword: function (password) {
      if (!password) return "";

      try {
          const encyptedPassword = crypto
              .createHash("sha256", this.salt)
              .update(password)
              .digest("hex");

          return encyptedPassword;
      } catch {
          return "";
      }
  },
  makeSalt: function () {
      return Math.round(new Date().valueOf() * Math.random()) + "";
  }
};

userSchema.virtual("password").set(function (password=generatePassword(16, false)) {
  if (password === "") return;

  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(password);
});

module.exports = Mongoose.model("User", userSchema);