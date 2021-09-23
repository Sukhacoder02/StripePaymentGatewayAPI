const router = require('express').Router();
const { AES } = require('crypto-js');
const User = require('../models/User');
const {
  verifyTokenAndAuthorize,
  verifyTokenAndAdmin,
} = require('./verifytoken');

// UPDATE user
router.put('/:id', verifyTokenAndAuthorize, async (req, res) => {
  if (req.body.password) {
    req.body.password = AES.encrypt(
      req.body.password,
      process.env.HASH_KEY
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE user
router.delete('/:id', verifyTokenAndAuthorize, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted!');
  } catch (err) {
    res.status(500).json(err);
  }
});
// GET USER
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password: passwordString, ...others } = user;
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});
// GET ALL USERS
router.get('/find', verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER STATS

router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
