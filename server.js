const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect('mongodb+srv://matancz99:Mcz858585@cluster0.8jkzb.mongodb.net/', {
})
.then(() => {
    console.log('connected to db');
})
.catch((err) => {
    console.log('error', err);
});

app.use(session({
    secret: 'My only secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(express.static(path.join(__dirname, 'public')));

const userRoutes = require('./routes/users-routes');
const postRoutes = require('./routes/chat-routes');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.use('/register' , (req, res) => {
    res.sendFile(path.join(__dirname, 'public','html' , 'register.html'));
});
app.use('/login' , (req, res) => {
    res.sendFile(path.join(__dirname, 'public','html' , 'login.html'));
});


app.use('/' , (req, res) => {
    if(req.session.userId){
        res.sendFile(path.join(__dirname, 'public','html' , 'posts.html'));
    }
    else{
        res.sendFile(path.join(__dirname, 'public','html' , 'login.html'));
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});