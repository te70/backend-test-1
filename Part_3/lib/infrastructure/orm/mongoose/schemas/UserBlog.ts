// const mongoose = require('mongoose');

const userBlogPostSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  blog_post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost',
  },
});

module.exports = mongoose.model('UserBlogPost', userBlogPostSchema);
