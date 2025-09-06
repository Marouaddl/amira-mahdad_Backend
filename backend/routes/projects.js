const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const router = express.Router();

router.use(protect); // Toutes les routes protégées
router.get('/', getProjects);
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }, { name: 'additionalImages', maxCount: 4 }]), createProject);
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }, { name: 'additionalImages', maxCount: 4 }]), updateProject);
router.delete('/:id', deleteProject);

module.exports = router;