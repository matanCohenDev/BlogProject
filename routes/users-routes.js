const { login , register , allUsers, ownUser, registerPage ,loginPage } = require('../controllers/user-controllers');
const express = require('express');
const User = require('../models/usersDB');
const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/user', ownUser);

router.get('/all-users', allUsers);

router.get('/register', registerPage);

router.get('/login', loginPage);

module.exports = router;