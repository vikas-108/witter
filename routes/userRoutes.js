const express = require('express');
const { registerUser, addContact, getUserById } = require('../controllers/userController');
const router = express.Router();

router.post('/login', registerUser);
router.post('/add-contact', addContact);
router.get('/:id', getUserById);


module.exports = router;
