import express from 'express';
import Blog from '../models/blog.model.js';
import {getAllBlogs,createBlog,updateBlog,getBlogById,deleteBlog,userBlog} from '../controllers/blog.controller.js'

const router = express.Router();


router.get('/allblogs', getAllBlogs);

router.post('/createblog', createBlog);

router.put('/updateblog/:id', updateBlog);

router.get('/getblog/:id', getBlogById);

router.delete('/deleteblog/:id', deleteBlog);

router.get('/userblogs/:id', userBlog);




export default router;