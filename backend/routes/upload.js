const express = require('express');
const router = express.Router();
const { uploadService, uploadFormation } = require('../config/upload');
const uploadController = require('../controllers/uploadController');
const { authMiddleware } = require('../controllers/adminController');

// ⭐ UPLOAD IMAGE SERVICE
router.post(
  '/service-image',
  authMiddleware,
  uploadService.single('image'),
  uploadController.uploadServiceImage
);

// ⭐ UPLOAD IMAGE FORMATION (NOUVEAU)
router.post(
  '/formation-image',
  authMiddleware,
  uploadFormation.single('image'),
  uploadController.uploadFormationImage
);

// ⭐ SUPPRESSION IMAGE SERVICE
router.delete(
  '/service-image/:filename',
  authMiddleware,
  uploadController.deleteServiceImage
);

// ⭐ SUPPRESSION IMAGE FORMATION (NOUVEAU)
router.delete(
  '/formation-image/:filename',
  authMiddleware,
  uploadController.deleteFormationImage
);

module.exports = router;