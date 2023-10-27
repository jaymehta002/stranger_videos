const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Video = require('../models/Video');
const auth = require('../middleware/auth');
const checkAdminRole = require('../middleware/adminToken');

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

router.post('/upload', auth, upload.single('video'), (req, res) => {
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
router.get('/upload', auth, (req, res) => {
    res.render('upload');
});

router.get('/videos', auth, (req, res) => {
    Video.find({})
      .sort({createdAt: -1})
      .then((videos) => {
        res.json(videos)
      })
      .catch((error) => {
        console.error('Error retrieving videos:', error);
      }); 
  });

  router.delete('/deleteVideo/:videoId', auth, checkAdminRole, (req, res) => {
    const videoId = req.params.videoId;
    Video.findByIdAndDelete(videoId)
        .then(deletedVideo => {
            if (!deletedVideo) {
                return res.status(404).json({ error: 'Video not found' });
            }
            res.json({ message: 'Video deleted successfully' });
        })
        .catch(error => {
            console.error('Error deleting video:', error);
            res.status(500).json({ error: 'Server error' });
        });
});

router.use('/uploads', express.static(path.join(__dirname, '../uploads')));
module.exports = router;