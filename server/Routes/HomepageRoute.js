const express = require('express');
const { subscribeUser, getAllSubscribers } = require('../controllers/HomepageController');

const router = express.Router();

router.post('/subscribe', subscribeUser);
router.get('/subscribers', getAllSubscribers);

module.exports = router;
