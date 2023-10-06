const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');
 
const router = express.Router();
const secretKey = 'secret';

const User = require('../models/user');

//config for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { 
        fileSize: 1 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(new Error('Only JPG files are allowed'));
        }
    },
});

//load existing blog posts
let blogPosts = [];
try {
    blogPosts = require('../blogs.json');
} catch(error) {
    blogPosts = [];
}

//generate reference number
const generateReferenceNumber = () => {
    return blogPosts.length > 0 ? blogPosts[blogPosts.length - 1].referenceNumber + 1: 1;
}

//Route for adding a new blog post
const addBlogPost = async (req, res) => {
    try {
        const { title, desc, date_time } = req.body;

        // Validate inputs
        if (!title || title.length < 5 || title.length > 50 || !desc || desc.length > 500 || !date_time || isNaN(date_time) || date_time <= Date.now()) {
            throw new Error("Invalid input data");
        }

        // Convert date to unix
        const unixDateTime = date_time instanceof Date ? date_time.getTime() : date_time;

        const referenceNumber = generateReferenceNumber();

        // Compress main image
        const mainImageBuffer = await sharp(req.file.buffer).resize({ width: 0.75 * req.file.size }).toBuffer();

        // Compress additional images
        const additionalImages = [];
        for (let i = 0; i < req.files.length; i++) {
            const compressedImage = await sharp(req.files[i].buffer).resize({ width: 0.75 * req.files[i].size }).toBuffer();
            additionalImages.push(compressedImage);
        }

        // Save images 
        const mainImageFileName = `images/main_${referenceNumber}.jpg`;
        fs.writeFileSync(mainImageFileName, mainImageBuffer);
        const additionalImageFileNames = additionalImages.map((image, index) => {
            const filename = `images/additional_${referenceNumber}_${index + 1}.jpg`;
            fs.writeFileSync(filename, image);
            return filename;
        });

        // Create blog post object
        const blogPost = {
            referenceNumber,
            title,
            desc,
            mainImage: mainImageFileName,
            additionalImages: additionalImageFileNames,
            date_time: unixDateTime,
        };

        // Save the blog post to the JSON file
        blogPosts.push(blogPost);
        fs.writeFileSync('./blogs.json', JSON.stringify(blogPosts, null, 2));

        // Assuming you have middleware to extract userId from the access token
        const userId = req.user.id; // Replace with how you access the userId

        // Create a new UserBlogPost entry
        const userBlogPost = new UserBlogPost({
        user_id: userId,
        blog_post_id: blogPost._id, // Assuming blogPost is the newly created blog post
        });

        // Save the UserBlogPost entry
        await userBlogPost.save();


        res.status(200).json(blogPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const getBlogPosts = (req, res) => {
    const formattedBlogPosts = blogPosts.map((post) => ({
        referenceNumber: post.referenceNumber,
        title: post.title,
        slug: post.title.toLowerCase().replace(/ /g, '_'),
        description: post.description,
        mainImage: post.mainImage,
        additionalImages: post.additionalImages,
        date_time: new Date(post.date_time).toISOString(),
    }));

    res.json(formattedBlogPosts);
};



const generateToken =  (req, res) => {
    try {
        const { image_path } = req.body;

        if (!image_path) {
            return res.status(500).json({ error: 'Image path is required' });
        }

        //create a token
        const token = jwt.sign({image_path}, secretKey, {expiresIn: '5m'});

        res.json({ token });
    } catch(error){
        res.status(500).json({error: 'There is an error'});
    }
};



const getImageByToken = (req, res) => {
    try {
        const {token, image_path} = req.body;

        if(!token || !image_path) {
            return res.status(500).json({error: 'Token and image_path are required'});
        }
            //verify token
            jwt.verify(token, secretKey, (err,decoded) => {
                if(err) {
                    return res.status(500).json({error: 'Invalid token'});     
                }

                //check if token is for image path
                if (decoded.image.path !== image_path) {
                    return res.status(500).json({error: 'Token does not match '})
                }

                //serve image
                res.sendFile(image_path, {root: '.'});
            });
    } catch(error){
        res.status(500).json({error: 'Internal server error'});
    }
};

const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id; 
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Trigger the middleware to remove associated entries
      await user.remove();
  
      res.status(200).end(); 
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
    
module.exports = { addBlogPost, getBlogPosts, generateToken, getImageByToken, deleteUser };