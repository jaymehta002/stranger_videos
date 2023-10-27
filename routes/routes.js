const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Video = require('../models/videoModel');

// Set up multer storage for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDirectory = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory);
    }
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Define route handlers
router.post('/upload', upload.single('video'), (req, res) => {
  const newVideo = new Video({
    title: req.body.title,
    description: req.body.description,
    videoUrl: path.join('uploads', req.file.filename),
  });
  newVideo.save()
    .then((video) => {
    res.redirect('/');
    })
    .catch((error) => {
      console.error('Error saving video:', error);
    });
});

router.get('/videos', (req, res) => {
  Video.find({})
    .sort({createdAt: -1})
    .then((videos) => {
      res.json(videos)
    })
    .catch((error) => {
      console.error('Error retrieving videos:', error);
    });
});

module.exports = router;
