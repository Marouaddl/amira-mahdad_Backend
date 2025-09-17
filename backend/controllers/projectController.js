const Project = require('../models/project');

// Fonction pour ajouter l'URL de base
const addBaseUrlToMedia = (req, project) => {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
  const baseUrl = `${protocol}://${req.get('host')}`;

  const p = project.toJSON ? project.toJSON() : project;

  if (p.image && !p.image.startsWith('http')) {
    p.image = `${baseUrl}/uploads/${p.image}`;
  }
  if (p.video && !p.video.startsWith('http')) {
    p.video = `${baseUrl}/uploads/${p.video}`;
  }
  if (p.additionalImages && Array.isArray(p.additionalImages)) {
    p.additionalImages = p.additionalImages.map(img =>
      img && !img.startsWith('http') ? `${baseUrl}/uploads/${img}` : img
    );
  }

  return p;
};

exports.getProjects = async (req, res) => {
  try {
    let projects = await Project.findAll();
    projects = projects.map(project => addBaseUrlToMedia(req, project));
    res.json(projects);
  } catch (err) {
    console.error('Error in getProjects:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createProject = async (req, res) => {
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);

  const { title, year, location, category, description } = req.body;

  // Stocker uniquement le filename
  const image = req.files?.image?.[0]?.filename || '';
  const video = req.files?.video?.[0]?.filename || '';
  const additionalImages = req.files?.additionalImages?.map(file => file.filename) || [];

  try {
    if (!title || !year || !location || !category) {
      return res.status(400).json({ error: 'Tous les champs obligatoires sont requis' });
    }

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

    res.status(201).json(addBaseUrlToMedia(req, project));
  } catch (err) {
    console.error('Error in createProject:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      files: req.files,
    });
    res.status(500).json({ error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, year, location, category, description } = req.body;

  // Stocker uniquement le filename
  const image = req.files?.image?.[0]?.filename;
  const video = req.files?.video?.[0]?.filename;
  const additionalImages = req.files?.additionalImages?.map(file => file.filename);

  try {
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ error: 'Projet non trouvé' });

    await project.update({
      title: title || project.title,
      year: year || project.year,
      location: location || project.location,
      category: category || project.category,
      description: description || project.description,
      image: image !== undefined ? image : project.image,
      video: video !== undefined ? video : project.video,
      additionalImages: additionalImages !== undefined ? additionalImages : project.additionalImages,
    });

    res.json(addBaseUrlToMedia(req, project));
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
