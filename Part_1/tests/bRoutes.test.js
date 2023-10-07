const { addBlogPost, generateToken, getImageByToken, getBlogPosts } = require('../routes/bRoutes')

describe('blog api routes', () => {
    it('should have a successfull post', async () => {
        const req = {
            body: {
              title: 'Sample Blog Post',
              desc: 'This is a sample blog post description.',
              date_time: Date.now() + 1000000, // A future date
            },
            file: {
              buffer: Buffer.from('sample-main-image-data'), // Mocked main image buffer
            },
            files: [
              { buffer: Buffer.from('sample-additional-image-1-data') }, // Mocked additional image 1 buffer
              { buffer: Buffer.from('sample-additional-image-2-data') }, // Mocked additional image 2 buffer
            ],
          };
      
          // Mocked response object
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
      
          // Call the route handler function directly
          await addBlogPost(req, res);
      
          // Check the response status code
          expect(res.status).toHaveBeenCalledWith(200);
      
          // Check if the response JSON contains the added blog post with the expected fields
          expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
              referenceNumber: expect.any(Number),
              title: 'Sample Blog Post',
              desc: 'This is a sample blog post description.',
              date_time: expect.toBeGreaterThan(Date.now() + 1000000),
              mainImage: expect.any(String), // Ensure it's a string representing the image path
              additionalImages: expect.arrayContaining([expect.any(String)]), // Ensure it's an array of image paths
              // Add other expected fields as needed
            })
          );
    });

    it('add invalid post and check for error message for missing fields', async() => {
        const req = {
            body: {
                title: 'Sample Blog Post',
            },
            file: {
                buffer: Buffer.from('sample-main-image-data'),
            },
            files: [],
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addBlogPost(req, res);

        expect(res.status).toHaveBeenCalledWith(500);   
    });

    it('should return an error message for an oversized image', async() => {
        const largeBuffer = Buffer.alloc(2 * 1024 * 1024);

        const req = {
            body: {
                title: 'Sample blog Post',
                desc: 'This is a sample blog post desc',
                date_time: Date.now() + 1000000,
            },
            file: {
                buffer: largeBuffer,
            },
            files: [],
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addBlogPost(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return an error message for a title with special characters', async() => {
        const titleWithSpecialCharacters = 'Sample blog post  #$%';

        const req = {
            body: {
                title: titleWithSpecialCharacters,
                desc: 'This is a sample blog post desc',
                date_time: Date.now() + 1000000,
            },
            file: {
                buffer: Buffer.from('sample-main-image-data'),
            },
            files: []
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addBlogPost(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return an error message for date_time as ISO string', async () => {
        const isoDateString = new Date().toISOString();

        const req = {
            body: {
                title: 'Simple Blog Post',
                desc: 'This is a sample blog post desc',
                date_time: isoDateString,
            },
            file: {
                buffer: Buffer.from('sample-main-image-data'),
            },
            files: [],
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addBlogPost(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should add a valid post and retrieve it succcessfully', async ()=> {
        const addReq = {
            body: {
                title: 'Sample blog post',
                desc: 'This is a sample blog post desc',
                date_time: Date.now() + 1000000.
            },
            file: {
                buffer: Buffer.from('sample-main-image-data'),
            },
            files: [
                {buffer: Buffer.from('sample-additional-image-1-data')},
                {buffer: Buffer.from('sample-additional-image-2-data')},
            ],
        };

        const addRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const getAllReq = {};
        const getAllRes = {
            json: jest.fn(),
        };

        await addBlogPost(addReq,addRes);

        expect(addRes.status).toHaveBeenCalledWith(200);

        await retrieveAllBlogPosts(getAllReq, getAllRes);

        const addedBlogPost = {
            title: 'Sample Blog Post',
            desc: 'This is a sample blog post descrption',
            date_time: expec.any(Number),
            mainImage: expect.ay(String),
            additionalImages: expect.arrayContaining([expect.any(String)]),
        };

        expect(getAllRes.json).toHaveBeenCalledWith(
            expect.arrayContaining([expect.objectContaining(addedBlogPost)])
        );
    });

    it('should not add and invalid blog post and verify it is not in the list', async () => {
        const invalidAddReq = {
            body: {
                title: 'Invalid Blog Post',
            },
            file: {
                buffer: Buffer.from('sample-main-image-data'),
            },
            files: [],
        };

        const invalidAddRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const getAllReq = {};
        const getAllRes = {
            json: jest.fn(),
        };

        await addBlogPost(invalidAddReq, invalidAddRes);

        expect(invalidAddRes.status).toHaveBeenCalledWith(500);

        await getBlogPosts(getAllReq, getAllRes);

        const invalidBlogPost = {
            title: 'Invalid Blog Post',
        };

        expect(getAllRes.json).not.toContainEqual(expect.objectContaining(invalidBlogPost));
    })

    it('should generate a token and retrieve the image successfully', async () => {
        const generateTokenReq = {
            body: {
                image_path: 'images/main_image_1_test.jpg',
            },
        };

        const generateTokenRes = {
            json: jest.fn(),
        };

        const getImageByTokenReq = {
            body:{
                token: '',
                image_path: 'images/main_image_1_test.jpg',
            },
        };

        const getImageByTokenRes = {
            sendFile: jest.fn(),
        };

        await generateToken(generateTokenReq, generateTokenRes);

        getImageByTokenReq.body.token = generateTokenRes.json.mock.calls[0][0].token;

        await getImageByToken(getImageByTokenReq, getImageByTokenRes);

        expect(getImageByTokenRes.sendFile).toHaveBeenCalledWith();
    });

    it('should generate a token and retrieve a "bad token" error for a different image path', async () => {
        const generateTokenReq = {
            body: {
                image_path: '../images/main_image_1_test.jpg',
            },
        };

        const generateTokenRes = {
            json: jest.fn(),
        };

        const getImageByTokenReq = {
            body: {
                token: '',
                image_path: '..images/main_image_1_test.jpg',
            },
        };

        const getImageByTokenRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await generateToken(generateTokenReq, generateTokenRes);

        getImageByTokenReq.body.token - generateTokenRes.json.mock.calls[0][0].token;

        await getImageByToken(getImageByTokenReq, getImageByTokenRes);

        expect(getImageByTokenRes.status).toHaveBeenCalledWith(500);
    })
});

