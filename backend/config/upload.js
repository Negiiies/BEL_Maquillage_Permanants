const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ⭐ STORAGE POUR SERVICES
const serviceUploadDir = path.join(__dirname, '../public/uploads/services');
if (!fs.existsSync(serviceUploadDir)) {
  fs.mkdirSync(serviceUploadDir, { recursive: true });
}

const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, serviceUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

// ⭐ STORAGE POUR FORMATIONS
const formationUploadDir = path.join(__dirname, '../public/uploads/formations');
if (!fs.existsSync(formationUploadDir)) {
  fs.mkdirSync(formationUploadDir, { recursive: true });
}

const formationStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, formationUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
  }
};

// ⭐ CONFIGURATION MULTER POUR SERVICES
const uploadService = multer({
  storage: serviceStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// ⭐ CONFIGURATION MULTER POUR FORMATIONS
const uploadFormation = multer({
  storage: formationStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = {
  uploadService,
  uploadFormation
};