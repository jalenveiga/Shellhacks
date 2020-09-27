const Blog = require('../model/blog');
const User = require('../model/user');

exports.write = (req,res,next) => {
    res.render('write-blog');
}

exports.postwrite =(req,res,next) => {
    const topic = req.body.topic;
    const desc = req.body.desc;
    var curday = function(sp){
        today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //As January is 0.
        var yyyy = today.getFullYear();
        
        if(dd<10) dd='0'+dd;
        if(mm<10) mm='0'+mm;
        return (mm+sp+dd+sp+yyyy);
        };
        console.log(curday('/'));
        console.log(curday('-'));

    const blog = new Blog ({
        title: topic,
        desc: desc,
        date: curday('-'),
        name: req.user.name,
        like: 0,
        comment: [],
        userid: req.user._id
    })
    blog.save().then(result => {
        let para = '/full-blog/' + result._id;
        console.log('Created a blog ', para);
         res.redirect(para);
    })
    .catch(err => console.log(err));
}

exports.fullblog=(req,res,next) => {
    const blogid = req.params.blogid;
    console.log(req.user._id);
    Blog.findById(blogid).then(blog => {
        const userid = blog.userid;
        User.findById(userid).then(user => {
            res.render('full-blog', {
                username: user.name,
                date: blog.date,
                topic: blog.title,
                desc: blog.desc,
                like: blog.like,
                blogid: blogid.toString(),
                likeuserid: [],
                comment: blog.comment,
                CurrUserId: req.user._id.toString()
            })
        })
        .catch(err => console.log(err));
       

    })
    .catch(err => console.log(err));   
}




exports.blog=(req,res,next) => {
    Blog.find()
    .then(result => {
        if(!result) {
            res.render('blogs',{
                isBlog: false,
                CurrUserId: req.user._id.toString(),
            })
            return;
        }
        
        res.render('blogs', {
            isBlog: true,
            blog: result,
            CurrUserId: req.user._id.toString(),
        })
        
    })
    .catch(err => console.log(err));

   
}

exports.commentBlog =(req,res,next) => {
    const blogid = req.params.blogid;
    const name = req.user.name;
    const userid= req.user._id;
    var curday = function(sp){
        today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //As January is 0.
        var yyyy = today.getFullYear();
        
        if(dd<10) dd='0'+dd;
        if(mm<10) mm='0'+mm;
        return (dd+sp+mm+sp+yyyy);
        };
        console.log(curday('/'));
        console.log(curday('-'));
    Blog.findById(blogid).then(result => {
        return result.docomment(req.body.comment, name,userid,curday('-'));
    })
    .then(t => { res.redirect('/full-blog/'+blogid)})
    .catch(err=> console.log(err));
}

exports.likeBlog = (req,res,next) => {
    console.log("yesss");
    const blogid = req.params.blogid;
    Blog.findById(blogid)
    .then(result => {
        return result.likeblog(blogid,req.user._id.toString());
    })
    .then(f => {
        console.log("hogaya");
        res.redirect('/full-blog/'+blogid);
    })


}

exports.deleteComment = (req,res,next) => {
    const commentId= req.params.commentid;
    const blogid = req.body.blogid;
    Blog.findById(blogid)
    .then(blog => {
        return blog.deleteComment(commentId, blogid);

    })
    .then(y => res.redirect('/full-blog/'+blogid))
    .catch(err => console.log(err));
}

exports.delBlog = (req,res,next) => {
    const blogid = req.params.blogid;
   
    Blog.findByIdAndRemove(blogid).then(result =>{
        console.log('removed');
        res.redirect('/blogs');
     })
    .catch(err => console.log(err));
}