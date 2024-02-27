const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

const connectDB = require("./database");

const multer = require('multer');
const fs = require('fs');

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Destination folder for uploaded files
    },
  });
  
const upload = multer({ storage: storage });


const jwt = require("jsonwebtoken");
const secret = 'randomtestforsecret';

connectDB();

const User = require("./models/UserModel");
const Post = require("./models/PostModel");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(__dirname+'/uploads'));

app.get('/', (req, res)=>{
    res.send("Blog")
})

app.post('/register', async (req, res)=>{
    const {username, password} = req.body;
    console.log(req.body);
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const userDoc = await User.create({username, password: hashedPassword});
        res.status(200).json(userDoc);
    }catch(e){
        res.status(400).json(e);
    }
})

app.post('/login', async (req, res)=>{
    const {username, password} = req.body;
    console.log(req.body);
    try{
        const userDoc = await User.findOne({username});
        const passOk = await bcrypt.compare(password, userDoc.password);
        if(passOk){
            jwt.sign({username, id:userDoc._id}, secret, {}, (err, token)=>{
                if(err) throw err;
                res.json({token, 
                  id:userDoc._id,
                  username
                });
            })
        }else{
            res.status(201).json("Wrong credentials");
        }
    }catch(e){
        res.status(400).json(e);
    }
})

app.get('/profile', async (req, res) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');

      jwt.verify(token, secret,{}, (err, info)=>{
          if(err) throw err;
          res.json(info);
      })
    } catch (error) {
      res.status(401).json({ error: 'Please authenticate' });
    }
})

app.post('/post', upload.single('file'), async (req, res)=>{
    const token = req.header('Authorization').replace('Bearer ', '');
    jwt.verify(token, secret,{}, async (err, info)=>{
        if(err) throw err;
        const { title, summary, content } = req.body;
        const {originalname, path} = req.file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const npath = path.replace('\\', '/');
        const imagePath = npath+'.'+ext;
        fs.renameSync(path, imagePath);

        const postDoc = await Post.create({
            title, 
            summary, 
            content, 
            cover:imagePath,
            author:info.id,
        });
        // console.log(postDoc);
        
        res.status(200).json(postDoc);
    
    })
});

app.put('/post', upload.single('file'), async (req, res)=>{
    const token = req.header('Authorization').replace('Bearer ', '');
    jwt.verify(token, secret, {}, async (err, info)=>{
        if(err) throw err;
        let imagePath = null;
        let newPath = null;
        if(req.file){
            const {originalname, path} = req.file;
            const parts = originalname.split(".");
            const ext = parts[parts.length - 1];
            newPath = path.replace('\\', '/');
            imagePath = newPath+'.'+ext;
            fs.renameSync(path, imagePath);
        }
        const {id, title, summary, content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if(!isAuthor){
            return res.status(400).json("You cannot edit this post")
        }
        // console.log(imagePath);
        postDoc.title = title;
            postDoc.summary = summary;
            postDoc.content = content;
            postDoc.cover = imagePath ? imagePath : postDoc.cover;
            await postDoc.save();

        res.json(postDoc);
    });
})

app.get('/post', async (req, res)=>{
    const post = await Post.find();
    res.json(
        await Post.find()
        .populate('author', ['username'])
        .sort({createdAt:-1})
        .limit(20)
        );
})

app.get('/post/:id', async (req, res)=>{
    const {id} = req.params;
    const postInfo = await Post.findById(id).populate('author', ['username']);
    res.status(200).json(postInfo);
})

// app.get('/profile', async (req, res) => {
//     try {
//       const user = await User.findById(req.userId);
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Return user data (excluding password)
//       res.json({ username: user.username, otherUserData: user.otherUserData }); // Adapt based on your model
//     } catch (err) {
//       console.error('Error fetching profile:', err);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });


// app.get('/profile', (req,res)=>{
//     const {token} = req.cookies;
//     console.log(req.cookies);
//     jwt.verify(token, secret, {}, (err, info)=>{
//         if(err) throw err;
//         res.json(info);
//     })
// })

app.listen(4000, () => {
    console.log(`Server is running on port 4000`);
    });
//y8osuJ33rYBjFTct