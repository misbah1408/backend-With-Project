import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
  id: {
    type: String, 
    required: true,
    unique: true,
  },
  video: {
    type: String,//cloudinary image
    required: true,
  },
  thumbnail: {
    type: String,//cloudinary image
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
},{timestamps:true});

videoSchema.plugin

const Video = mongoose.model("Video", videoSchema);

export default videoSchema