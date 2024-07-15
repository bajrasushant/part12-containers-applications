const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  author: { type: String, default: "unknown" },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  url: String,
  likes: { type: Number, default: 0 },
  comments: [String]
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject._v;
  }
});

module.exports = mongoose.model("Blog", blogSchema);
