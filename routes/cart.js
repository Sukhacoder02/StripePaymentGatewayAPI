const {
  verifyTokenAndAdmin,
  verifyToken,
  verifyTokenAndAuthorize,
} = require('./verifytoken');
const Cart = require('./../models/Cart');
const router = require('express').Router();

// CREATE cart
router.post('/', verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE cart
router.delete('/:id', verifyTokenAndAuthorize, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json('Product deleted successfully!');
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE cart

router.get('/:id', verifyTokenAndAuthorize, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET user cart

router.get('/:id', verifyTokenAndAuthorize, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.id });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL carts of all users

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
