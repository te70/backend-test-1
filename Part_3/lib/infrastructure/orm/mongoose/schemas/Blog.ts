const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  description: {
    type: String,
    required: true,
    maxLength: 500,
  },
  mainImage: {
    type: String, 
    required: true,
  },
  additionalImages: [{
    type: String, 
  }],
  date_time: {
    type: Date,
    default: Date.now,
    required: true,
  },
  user_blog_posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserBlog',
    },
  ],
});

module.exports = mongoose.model('Blog', blogSchema);
