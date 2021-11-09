const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true 
  },
  user: {
    type: Mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  history: {
    type: [{
      title: String,
			description: String,
			image: String,
			modifiedAt: Date,
      index: false
    }],
    default: []
  },
  likes: {
    type: [{
      type: Mongoose.Types.ObjectId,
      ref: "User"
    }],
    default: []
  },
  comment: {
    type: [{
      description: {
        type: String,
        required: true
      },
      user: {
        type: Mongoose.Types.ObjectId,
        ref: "User"
      }
    }],
    default: []
  }
}, { timestamps: true });

module.exports = Mongoose.model("Post", PostSchema);