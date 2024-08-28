const express = require('express');
const router = express.Router();
const GroupChat = require('../models/groupDB');
const { AddMessage, GetMessages } = require('../controllers/groupChat-controllers');

router.post('/groupChat', AddMessage);

router.get('/groupChat', GetMessages);

module.exports = router;