const express = require('express');
const app = express();
const isAuth = require('./routes/isAuth');
const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));
const bcrypt = require('bcryptjs');
const path = require('path'); 
const mongoose= require('mongoose');
const User = require('./model/user');
const Blog = require('./model/blog');
const session = require('express-session');
const blogController = require('./routes/blog')
app.use(express.static(path.join(__dirname,'public'))); //to join css (check the video)

/* Mongo stuff ............. */
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGO_URI = 'mongodb+srv://Prerna:papa2000@cluster0.408pe.mongodb.net/ShellHacks?retryWrites=true&w=majority';
const store = new MongoDBStore({
    uri : MONGO_URI
    ,collection: 'sessions'
});
app.use(session({secret:'my secret', 
resave: false,
cookie: {maxAge: 360000*24},
 saveUninitialized: false,
 store: store}))

 console.log(1);

 /** Saving body to req body sesssion */

/*......Views EJS ........*/
app.set('view engine', 'ejs');
app.set('views','views');


app.use((req,res,next) => {
    res.locals.isAuthenticated =false;
    res.locals.users1 =[];
    User.find()
    .then(result => {
        res.locals.users1 = [...result];
        console.log("hello" ,res.locals.users1)
    })
    if(req.session.user)
    {res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.email = req.session.user.email}
    
    next();
 })

 console.log(1);
app.use((req,res,next) => {

    User.findById(req.session.user)
 .then(user => {
     if(user)
   { req.user = user; console.log(req.user)}
   else console.log("No found")
   next();
 })
 .catch(err => console.log(err));
 })

 console.log(1);
 app.use(blogController.router);

 console.log(1);
 app.get('/debates',isAuth.authCheck,(req,res,next) => {
    res.render('debate')
})

app.get('/games', (req,res,next) => {
    res.render('game');
})

app.get('/disc',isAuth.authCheck,(req,res,next) => {
    res.render('disc')
})
app.get('/dashboard',isAuth.authCheck,(req,res,next) => {

   Blog.find({userid: req.session.user._id})
   .then(bl => {
    User.findById(req.session.user._id).then(user => {
        res.render('dashboard',{
            username:req.user.name,
            blog: bl
        })
    })
    .catch(err => console.log(err));  
   })
   .catch(err => console.log(err));
    
})
app.get('/login', (req,res,next) => {
    res.render('login');
})

console.log(12);
app.post('/login',(req,res,next) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({email: email})
    .then(user => {
        //console.log("USERMODEL",user._id)
        if(!user) {
             console.log("NO USER")
          
          return res.redirect('/login');
       }
        bcrypt.compare(password, user.password).then(doMatch => {
              console.log(doMatch);
              if(doMatch) {
                req.session.user = user //new UserModel(user.name,user.email,user.cart, user._id);
                req.session.isLoggedIn = true
             return  req.session.save((err) => {
                     console.log(err);
                     console.log("Yesss");
                     res.redirect('/dashboard');
               })
              }
              else {   console.log('Invalid Email/Password');
                    res.redirect('/login')}
        }).catch(err => {
              console.log(err);
              res.redirect('/login');
        })
        
    })
    .catch(err => console.log(err));
  })

 

app.get('/signup', (req,res,next) => {
    res.render('signup');
})

app.post('/signup', (req,res,next) => {
    const email = req.body.email;
    const name = req.body.username;
    const password = req.body.password;
    User.findOne({email:email})
    .then(userDoc => {
        if(userDoc) {
           console.log("Email Already Exists");
            return res.redirect('/signup');
        }
        return bcrypt.hash(password, 12).then(hashedPassword => {
            const user = new User({
                  name: name,
                  email: email,
                  password: hashedPassword
            })
            return user.save();
      })
      .then(result => {
            console.log("Hey created")
            console.log("You can Login with your account now!!");
            res.redirect('/login');
            
         })
      }); 
    })
    app.post('/logout', isAuth.authCheck,(req,res,next) => {
        req.session.destroy((err) => {
              //console.log(err);
             console.log("yessssssssssssssssssssssss");
              res.redirect('/login');
        })
     
     } ) 
    
app.get('/', (req,res,next) => {
    res.render('landing');
})




mongoose.connect(MONGO_URI)
.then(result => {

    console.log("App")
    app.listen(3001);

})




