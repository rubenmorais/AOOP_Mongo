import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false 
  },
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  isNew: {
    type: Boolean,
    default: true
  }
}, { 
  versionKey: false,
  strict: true 
});

const Comment = mongoose.model('Comment', commentSchema, 'comments');

export default Comment;