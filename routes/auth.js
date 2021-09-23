const router = require('express').Router();
const User = require('./../models/User');
const AES = require('crypto-js/aes');
const Crypto = require('crypto-js');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: AES.encrypt(req.body.password, process.env.HASH_KEY).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
    console.log(savedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    if (!user) res.status(401).json('Wrong Credentials');
    const hashedPassword = AES.decrypt(user.password, process.env.HASH_KEY);
    const password = hashedPassword.toString(Crypto.enc.Utf8);

    password !== req.body.password &&
      res.status(401).json('Password Incorrect');

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_HASH,
      { expiresIn: '3d' }
    );
    const { password: passwordString, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
