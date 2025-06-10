// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/messageController');

router.post('/get-messages', getMessages);

module.exports = router;
