import { Router } from 'express';
const router = Router();

router.post('/add-blog', upload.single('mainImage'), upload.array('additionalImages', 5), addBlogPost);
router.get('/get-blog', getBlogPosts);
router.post('/generate-token', generateToken);
router.post('/generate-image', getImageByToken);

export default router;