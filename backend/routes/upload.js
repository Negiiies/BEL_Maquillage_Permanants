const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const uploadController = require('../controllers/uploadController');
const { authMiddleware } = require('../controllers/adminController');

// Upload d'une image (protégé par auth admin)
router.post(
  '/service-image',
  authMiddleware,
  upload.single('image'),
  uploadController.uploadServiceImage
);

// Suppression d'une image (protégé par auth admin)
router.delete(
  '/service-image/:filename',
  authMiddleware,
  uploadController.deleteServiceImage
);

module.exports = router;