const express = require('express');
const router = express.Router();
const User = require('../models/usersDB');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  const { username , email, password } = req.body;

  try {
    let user = await User.findOne({email});
    if(user)
        return res.status(400).json({ msg: 'User already exists' });

    user = new User({username, email,password: await bcrypt.hash(password, 10)});

    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
    }
    catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user =await User.findOne({username});
        if(!user)
            return res.status(400).json({ msg: 'User not found' });
 
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(400).json({ msg: 'Invalid credentials' });

        res.status(200).json({ msg: 'Login successful', user: user.username });

    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/all-users', async (req, res) => {
    try {
        const users = await User.find({}, 'username');
        console.log(users); 
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;