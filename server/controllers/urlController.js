const validator = require('validator');
const { UAParser } = require('ua-parser-js');
const geoip = require('geoip-lite');
const Url = require('../models/Url');
const Click = require('../models/Click');
const generateShortCode = require('../utils/generateShortCode');

const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: 'originalUrl is required' });
    }

    if (!validator.isURL(originalUrl, { require_protocol: true })) {
      return res.status(400).json({
        message: 'Please provide a valid URL, including http:// or https://',
      });
    }

    let shortCode;
    let codeExists = true;

    while (codeExists) {
      shortCode = generateShortCode();
      const existingUrl = await Url.findOne({ shortCode });
      if (!existingUrl) {
        codeExists = false;
      }
    }

    const newUrl = await Url.create({
      originalUrl,
      shortCode,
      user: req.user._id,
    });

    res.status(201).json(newUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logClick = async (url, req) => {
  const { device, browser, os } = new UAParser(req.headers['user-agent']).getResult();
  const geo = geoip.lookup(req.ip);

  await Click.create({
    url: url._id,
    device: device.type || 'desktop',
    browser: browser.name || 'Unknown',
    os: os.name || 'Unknown',
    country: geo?.country || 'Unknown',
    city: geo?.city || 'Unknown',
    lat: geo?.ll?.[0] ?? null,
    lon: geo?.ll?.[1] ?? null,
    referrer: req.headers.referer || 'Direct',
  });
};

const redirectToUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    url.clicks += 1;
    await url.save();

    logClick(url, req).catch(console.error);

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllUrls = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 5 } = req.query;

    const filter = { user: req.user._id };

    if (search) {
      filter.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 5;

    const totalCount = await Url.countDocuments(filter);
    const urls = await Url.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({
      urls,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum) || 1,
      totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const totalLinks = await Url.countDocuments({ user: req.user._id });

    const clicksResult = await Url.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: '$clicks' },
        },
      },
    ]);

    const totalClicks = clicksResult.length > 0 ? clicksResult[0].totalClicks : 0;

    res.status(200).json({ totalLinks, totalClicks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const url = await Url.findById(id);

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    if (url.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this URL' });
    }

    await url.deleteOne();

    res.status(200).json({ message: 'URL deleted successfully', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getUrlClicks = async (req, res) => {
  try {
    const { id } = req.params;

    const url = await Url.findById(id);

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    if (url.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this URL\'s analytics' });
    }

    const clicks = await Click.find({ url: id }).sort({ createdAt: -1 }).limit(50);

    const buildSummary = async (field) => {
      const result = await Click.aggregate([
        { $match: { url: url._id } },
        { $group: { _id: `$${field}`, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]);
      return result.length > 0 ? result[0]._id : 'N/A';
    };

    const [topDevice, topBrowser, topCountry] = await Promise.all([
      buildSummary('device'),
      buildSummary('browser'),
      buildSummary('country'),
    ]);

    res.status(200).json({
      clicks,
      summary: { topDevice, topBrowser, topCountry },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { shortenUrl, redirectToUrl, getAllUrls, getStats, deleteUrl, getUrlClicks };