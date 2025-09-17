// backend/routes/projects.js
const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const router = express.Router();

// Public route: No authentication required
router.get('/', getProjects);

// Protected routes: Require JWT token
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'additionalImages', maxCount: 4 },
  ]),
  createProject
);
router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'additionalImages', maxCount: 4 },
  ]),
  updateProject
);
router.delete('/:id', protect, deleteProject);

module.exports = router;