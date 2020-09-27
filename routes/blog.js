const express= require('express');
const router = express.Router();
const isAuth = require('../routes/isAuth');
const blog = require('../controllers/blog.js');

router.get('/write-blog',isAuth.authCheck,blog.write);
router.post('/write-blog',isAuth.authCheck,blog.postwrite);
router.get('/blogs',isAuth.authCheck,blog.blog);
router.post('/full-blog/:blogid',isAuth.authCheck,blog.fullblog);
router.get('/full-blog/:blogid',isAuth.authCheck,blog.fullblog);
router.post('/l-blog/:blogid',isAuth.authCheck,blog.likeBlog);
router.post('/c-blog/:blogid',isAuth.authCheck,blog.commentBlog);
router.post('/delCom/:commentid',isAuth.authCheck, blog.deleteComment);
router.post('/delBlog/:blogid',isAuth.authCheck,blog.delBlog);
exports.router=router;