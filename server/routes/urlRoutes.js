const express = require('express');
const router = express.Router();
const { shortenUrl, getAllUrls, getStats, deleteUrl, getUrlClicks } = require('../controllers/urlController');
const { protect } = require('../middleware/authMiddleware');

router.post('/shorten', protect, shortenUrl);
router.get('/urls', protect, getAllUrls);
router.get('/stats', protect, getStats);
router.delete('/urls/:id', protect, deleteUrl);
router.get('/urls/:id/clicks', protect, getUrlClicks);

module.exports = router;