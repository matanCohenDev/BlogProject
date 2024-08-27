const { login , register , allUsers, ownUser, logout} = require('../controllers/user-controllers');
const express = require('express');
const User = require('../models/usersDB');
const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout' , logout);

router.get('/user', ownUser);

router.get('/all-users', allUsers);

module.exports = router;