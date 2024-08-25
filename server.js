const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

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

app.use(express.static(path.join(__dirname, 'public')));

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});