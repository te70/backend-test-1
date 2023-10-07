const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');
 
const router = express.Router();
const secretKey = 'secret';

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
        const { title, desc, date_time, mainImages, additionalImages } = req.body;

        // Validate inputs
        if (!title || title.length < 5 || title.length > 50) {
            return res.status(500).json({ error: 'Title must be between 5 and 50 characters' });
        }

        if (!desc || desc.length > 500) {
            return res.status(500).json({ error: 'Description cannot be empty and must be less than 500 characters' });
        }

        if (!date_time || isNaN(date_time) || date_time <= Date.now()) {
            return res.status(500).json({ error: 'Invalid date_time' });
        }

        if (mainImages[0].size > 1024 * 1024) {
            return res.status(500).json({ error: 'Main image size exceeded 1MB' });
        }

        if (/[!@#$%^&*(),.?":{}|<>]/.test(title)) {
            return res.status(500).json({ error: 'Title has special characters' });
        }

        if (isNaN(date_time)) {
            return res.status(500).json({ error: 'Date time is not a valid number' });
        }

        // Convert date to unix
        const unixDateTime = date_time instanceof Date ? date_time.getTime() : date_time;

        const referenceNumber = generateReferenceNumber();

        // Compress main image
        const mainImageBuffer = await sharp(mainImages[0].buffer).resize({ width: 0.75 * mainImages[0].size }).toBuffer();

        // Compress additional images
        const additionalImagesBuffers = [];
        for (let i = 0; i < additionalImages.length; i++) {
            const compressedImage = await sharp(additionalImages[i].buffer).resize({ width: 0.75 * additionalImages[i].size }).toBuffer();
            additionalImagesBuffers.push(compressedImage);
        }

        // Save images 
        const mainImageFileName = `images/main_${referenceNumber}.jpg`;
        fs.writeFileSync(mainImageFileName, mainImageBuffer);
        const additionalImageFileNames = additionalImagesBuffers.map((image, index) => {
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

router.post('/add-blog', upload.single('mainImage'), upload.array('additionalImages', 5), addBlogPost);
router.get('/get-blog', getBlogPosts);
router.post('/generate-token', generateToken);
router.post('/generate-image', getImageByToken);

module.exports = router;



module.exports = { addBlogPost, generateToken, getImageByToken, getBlogPosts };