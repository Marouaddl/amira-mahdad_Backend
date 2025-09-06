const Profile = require('../models/profile');

exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Créer un profil par défaut avec des valeurs cohérentes
      profile = await Profile.create({
        fullName: 'Amira Mahdad',
        title: 'Architecte DPLG',
        description: 'Spécialisée en conception architecturale moderne...',
        experience: '8', // Utilisez 'experience' partout pour être cohérent
        email: 'amira.mahdad@email.com',
        phone: '+213 XX XX XX XX',
        location: 'Alger, Algérie',
        projectsCompleted: '24',
        satisfiedClients: '18',
        certifications: '6',
        // Supprimez yearsExperience pour éviter la duplication
      });
    }
    
    // Renvoyer les données avec une structure cohérente
    const responseData = {
      fullName: profile.fullName,
      title: profile.title,
      description: profile.description,
      experience: profile.experience, // Toujours utiliser 'experience'
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      projectsCompleted: profile.projectsCompleted,
      satisfiedClients: profile.satisfiedClients,
      certifications: profile.certifications
    };
    
    res.json(responseData);
  } catch (err) {
    console.error('Erreur dans getProfile:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { fullName, title, description, experience, email, phone, location, projectsCompleted, satisfiedClients, certifications } = req.body;
  
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ error: 'Profil non trouvé' });
    }
    
    await profile.update({
      fullName,
      title,
      description,
      experience, // Utilisez uniquement 'experience'
      email,
      phone,
      location,
      projectsCompleted,
      satisfiedClients,
      certifications
      // Ne pas mettre à jour yearsExperience pour éviter la confusion
    });
    
    res.json(profile);
  } catch (err) {
    console.error('Erreur dans updateProfile:', err);
    res.status(500).json({ error: err.message });
  }
};