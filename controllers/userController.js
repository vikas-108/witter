// controllers/userController.js
const User = require('../models/User');

exports.registerUser = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await User.create({ phoneNumber });
    }
    res.status(200).json({ message: "User login success", user });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Add contact controller
exports.addContact = async (req, res) => {
  const { userId, contactPhone } = req.body;

  try {
    const user = await User.findById(userId);
    const contact = await User.findOne({ phoneNumber: contactPhone });

    if (!user || !contact) {
      return res.status(404).json({ message: "User or Contact not found" });
    }

    // Prevent duplicates
    if (user.contacts.includes(contact._id)) {
      return res.status(400).json({ message: "Contact already added" });
    }

    user.contacts.push(contact._id);
    await user.save();

    res.status(200).json({ message: "Contact added", contact });
  } catch (error) {
    res.status(500).json({ message: "Error adding contact", error });
  }
};
// add user by api id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('contacts');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', err });
  }
};
