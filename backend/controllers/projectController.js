const Project = require('../models/project');

// Fonction pour nettoyer les noms de fichiers
const sanitizeFileName = (filename) => {
  return filename
    .normalize("NFD")                  // enlever les accents
    .replace(/[\u0300-\u036f]/g, "")   // supprimer les diacritiques
    .replace(/[^a-zA-Z0-9._-]/g, "_"); // remplacer caractères spéciaux/espaces par "_"
};

// Fonction pour ajouter l'URL de base au champ video
const addBaseUrlToVideo = (req, project) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const p = project.toJSON ? project.toJSON() : project;

  // Only modify the video field if it exists and is not already an absolute URL
  if (p.video && !p.video.startsWith('http://') && !p.video.startsWith('https://')) {
    p.video = baseUrl + p.video;
  }

  return p;
};

exports.getProjects = async (req, res) => {
  try {
    let projects = await Project.findAll();
    projects = projects.map(project => addBaseUrlToVideo(req, project));
    res.json(projects);
  } catch (err) {
    console.error('Error in getProjects:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createProject = async (req, res) => {
  const { title, year, location, category, description } = req.body;

const image = req.files && req.files['image'] && req.files['image'][0]
  ? `/uploads/${sanitizeFileName(req.files['image'][0].filename)}`
  : '';
const video = req.files && req.files['video'] && req.files['video'][0]
  ? `/uploads/${sanitizeFileName(req.files['video'][0].filename)}`
  : '';
const additionalImages = req.files && req.files['additionalImages']
  ? req.files['additionalImages'].map(file => `/uploads/${sanitizeFileName(file.filename)}`)
  : [];

  try {
    const project = await Project.create({
      title,
      year,
      location,
      category,
      description,
      image,
      video,
      additionalImages,
    });
    res.status(201).json(addBaseUrlToVideo(req, project));
  } catch (err) {
    console.error('Error in createProject:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, year, location, category, description } = req.body;

  const image = req.files['image']
    ? `/uploads/${sanitizeFileName(req.files['image'][0].filename)}`
    : undefined;

  const video = req.files['video']
    ? `/uploads/${sanitizeFileName(req.files['video'][0].filename)}`
    : undefined;

  const additionalImages = req.files['additionalImages']
    ? req.files['additionalImages'].map(file => `/uploads/${sanitizeFileName(file.filename)}`)
    : undefined;

  try {
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ error: 'Projet non trouvé' });

    await project.update({
      title,
      year,
      location,
      category,
      description,
      image: image || project.image,
      video: video || project.video,
      additionalImages: additionalImages || project.additionalImages,
    });

    res.json(addBaseUrlToVideo(req, project));
  } catch (err) {
    console.error('Error in updateProject:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ error: 'Projet non trouvé' });

    await project.destroy();
    res.json({ message: 'Projet supprimé' });
  } catch (err) {
    console.error('Error in deleteProject:', err);
    res.status(500).json({ error: err.message });
  }
};