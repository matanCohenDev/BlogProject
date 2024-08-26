const express = require('express');
const router = express.Router();
const Post = require('../models/postDB');
const { AddMessage, GetMessages } = require('../controllers/chat-controllers');

router.post('/posts', AddMessage);

router.get('/posts', GetMessages);

module.exports = router;
