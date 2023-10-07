// const mongoose = require('mongoose');
const UserBlogPost = require('./userBlogPost'); 
const BlogPost = require('./blogPost'); 

const userSchema = new mongoose.Schema({
  
});

userSchema.pre('remove', async function (next) {
  try {
    await UserBlogPost.deleteMany({ user_id: this._id });

    await BlogPost.deleteMany({ 'user_blog_posts.user_id': this._id });

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
