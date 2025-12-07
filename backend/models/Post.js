import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: String,
  text: String,
  imageUrl: String,
  tags: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // <- важливо!
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  viewsCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Post', PostSchema);
