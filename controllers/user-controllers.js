const express = require('express');
const router = express.Router();
const User = require('../models/usersDB');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user)
            return res.status(400).json({ msg: 'User already exists' });

        user = new User({ username, email, password: await bcrypt.hash(password, 10) });

        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

const registerPage = (req, res) => {
    res.sendFile(__dirname , 'public' , 'html' , 'register.html');
}

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user)
            return res.status(400).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ msg: 'Invalid credentials' });

        req.session.userId = user._id;

        res.status(200).json({ msg: 'Login successful', user: user.username });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

const loginPage = (req, res) => {
    res.sendFile(__dirname + '/public/html/login.html');
}

const ownUser = async (req, res) => {
    if(!req.session.userId) {
        console.log('Unauthorized access attempt.');
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
        const user = await User.findById(req.session.userId);
        if(!user) {
            console.log('User not found in the database.');
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json({ user: user.username });
    } catch(err) {
        console.error('Server error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
}

const allUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username');
        console.log(users); 
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = { register, login, allUsers , ownUser, registerPage ,loginPage};
