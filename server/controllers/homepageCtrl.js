const Craft = require('../Models/HomepageModel');

/**
 * Middleware to handle async errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @desc   Subscribe a new user
 * @route  POST /api/subscribe
 * @access Public
 */
const subscribeUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: '⚠️ Email is required!' });
  }

  const existingSubscriber = await Craft.findOne({ email });
  if (existingSubscriber) {
    return res.status(409).json({ success: false, message: '📩 You are already subscribed!' });
  }

  const newSubscriber = await Craft.create({
    email,
    message: 'New Subscription',
  });

  res.status(201).json({
    success: true,
    message: '✅ Subscription successful!',
    subscriber: { email: newSubscriber.email, subscribedAt: newSubscriber.createdAt },
  });
});

/**
 * @desc   Get all subscribers
 * @route  GET /api/subscribers
 * @access Public
 */
const getAllSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Craft.find().sort({ createdAt: -1 }); // newest first

  res.status(200).json({
    success: true,
    count: subscribers.length,
    subscribers,
  });
});

module.exports = { subscribeUser, getAllSubscribers };
