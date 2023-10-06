const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs-extra');

const router = express.Router();

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
router.post('/add-blog', upload.single('mainImage'), upload.array('additionalImages', 5), async (req, res) => {
    try {
        const{title, desc, date_time} = req.body;

        //validate inputs
        if(!title || title.length < 5 || title.length > 50 || description || description.length > 500 || !date_time || isNaN(date_time) || date_time <= Date.now()) {
            throw new Error("Invalid input data");
        }

        //convert date to unix
        const unixDateTime = date_time instanceof Date ? date_time.getTime() : date_time;

        const referenceNumber = generateReferenceNumber();

        //compress main image
        const mainImageBuffer = await sharp(req.file.buffer).resize({width: 0.75 * req.file.size}).toBuffer();
        
        //compress additional images
        const additionalImages = [];
        for (let i = 0; i < req.files.length; i++) {
            const compressedImage = await sharp(req.files[i].buffer).resize({width: 0.75 * req.files[i].size }).toBuffer();
            additionalImages.push(compressedImage);
        }

        //save images 
        const mainImageFileName = `images/main_${referenceNumber}.jpg`;
        fs.writeFileSync(mainImageFileName, mainImageBuffer);
        const additionalImageFileNames = additionalImages.map((image, index) => {
            const filename = `images/additional_${referenceNumber}_${index + 1}.jpg`;
            fs.writeFileSync(filename, image);
            return filename;
        });

        //create blog post object
        const blogPost = {
            referenceNumber,
            title,
            desc,
            mainImage: mainImageFileName,
            additionImages: additionalImageFileNames,
            date_time: unixDateTime,
        };

        //save the blog post to the JSON file
        blogPosts.push(blogPost);
        fs.writeFileSync('./blogs.json', JSON.stringify(blogPosts, null, 2));

        res.status(200).json(blogPost);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;