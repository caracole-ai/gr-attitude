-- Demo Data Seed for GR-attitude
-- Run with: sqlite3 gr_attitude.sqlite < seed-demo.sql

-- Reset database (optional)
DELETE FROM correlations;
DELETE FROM contributions;
DELETE FROM offers;
DELETE FROM missions;
DELETE FROM users;

-- Users (25 demo users)
-- Password: Demo123! (hashed with bcrypt)
INSERT INTO users (id, email, displayName, passwordHash, avatarUrl, skills, interests, availabilityHours, maxDistanceKm, createdAt, updatedAt) VALUES
('user-1', 'marie.dubois@email.fr', 'Marie Dubois', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=1', 'JavaScript,Design', 'Technologie,Culture', 20, 50, datetime('now'), datetime('now')),
('user-2', 'pierre.martin@email.fr', 'Pierre Martin', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=2', 'Plomberie,Bricolage', 'Solidarité,Artisanat', 15, 30, datetime('now'), datetime('now')),
('user-3', 'sophie.bernard@email.fr', 'Sophie Bernard', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=3', 'Cuisine,Jardinage', 'Écologie,Bien-être', 25, 40, datetime('now'), datetime('now')),
('user-4', 'thomas.petit@email.fr', 'Thomas Petit', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=4', 'TypeScript,React', 'Technologie,Sport', 30, 60, datetime('now'), datetime('now')),
('user-5', 'julie.roux@email.fr', 'Julie Roux', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=5', 'Marketing,Langues', 'Éducation,Culture', 18, 35, datetime('now'), datetime('now')),
('user-6', 'lucas.moreau@email.fr', 'Lucas Moreau', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=6', 'Électricité,Menuiserie', 'Artisanat,Nature', 22, 45, datetime('now'), datetime('now')),
('user-7', 'emma.simon@email.fr', 'Emma Simon', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=7', 'Design,Peinture', 'Culture,Bien-être', 16, 25, datetime('now'), datetime('now')),
('user-8', 'antoine.michel@email.fr', 'Antoine Michel', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=8', 'Informatique,Python', 'Technologie,Éducation', 28, 55, datetime('now'), datetime('now')),
('user-9', 'camille.laurent@email.fr', 'Camille Laurent', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=9', 'Couture,Musique', 'Culture,Solidarité', 14, 20, datetime('now'), datetime('now')),
('user-10', 'maxime.lefevre@email.fr', 'Maxime Lefevre', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=10', 'Mécanique,Transport', 'Sport,Nature', 24, 70, datetime('now'), datetime('now')),
('user-11', 'claire.garcia@email.fr', 'Claire Garcia', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=11', 'Yoga,Méditation', 'Bien-être,Spiritualité', 20, 35, datetime('now'), datetime('now')),
('user-12', 'hugo.richard@email.fr', 'Hugo Richard', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=12', 'Photographie,Vidéo', 'Art,Technologie', 18, 40, datetime('now'), datetime('now')),
('user-13', 'lea.durand@email.fr', 'Léa Durand', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=13', 'Comptabilité,Excel', 'Finance,Administration', 25, 30, datetime('now'), datetime('now')),
('user-14', 'nathan.robert@email.fr', 'Nathan Robert', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=14', 'Menuiserie,Ébénisterie', 'Artisanat,Design', 16, 45, datetime('now'), datetime('now')),
('user-15', 'sarah.blanc@email.fr', 'Sarah Blanc', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=15', 'Traduction,Langues', 'Littérature,Voyages', 22, 50, datetime('now'), datetime('now')),
('user-16', 'kevin.rousseau@email.fr', 'Kevin Rousseau', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=16', 'Mécanique,Carrosserie', 'Automobile,Technologie', 20, 60, datetime('now'), datetime('now')),
('user-17', 'melanie.girard@email.fr', 'Mélanie Girard', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=17', 'Graphisme,Illustration', 'Art,Design', 24, 35, datetime('now'), datetime('now')),
('user-18', 'julien.morel@email.fr', 'Julien Morel', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=18', 'Électronique,Arduino', 'Technologie,DIY', 28, 55, datetime('now'), datetime('now')),
('user-19', 'laura.fournier@email.fr', 'Laura Fournier', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=19', 'Massage,Réflexologie', 'Bien-être,Santé', 15, 25, datetime('now'), datetime('now')),
('user-20', 'romain.andre@email.fr', 'Romain André', '$2b$10$z1paRE8LJMzcdz./9K7tQOrU9TQU//XSGVB0IRzeZ2B2LioD2qvG2', 'https://i.pravatar.cc/150?img=20', 'Escalade,Alpinisme', 'Sport,Nature', 26, 70, datetime('now'), datetime('now'));

-- Missions (60+ missions)
INSERT INTO missions (id, creatorId, title, description, category, helpType, urgency, status, tags, locationLat, locationLng, expiresAt, createdAt) VALUES
-- Missions urgentes
('mission-1', 'user-1', 'Aide au déménagement urgent', 'Recherche aide pour déménager un appartement 2 pièces du 3ème étage sans ascenseur', 'demenagement', 'ponctuel', 'urgent', 'ouverte', 'transport,force', 48.8566, 2.3522, datetime('now', '+7 days'), datetime('now', '-2 days')),
('mission-2', 'user-2', 'Réparation fuite eau', 'Besoin plombier pour réparer une fuite sous évier de la cuisine', 'bricolage', 'urgent', 'urgent', 'ouverte', 'plomberie', 45.7640, 4.8357, datetime('now', '+3 days'), datetime('now', '-1 day')),
('mission-3', 'user-3', 'Garde enfant malade urgent', 'Mon fils est malade, école fermée, besoin aide garde aujourd''hui 14h-18h', 'garde_enfants', 'ponctuel', 'urgent', 'ouverte', 'garde,urgent', 43.2965, 5.3698, datetime('now', '+1 day'), datetime('now', '-3 hours')),
('mission-4', 'user-4', 'Voiture en panne urgence', 'Voiture tombée en panne sur autoroute A6, besoin remorquage ou dépannage rapide', 'transport', 'ponctuel', 'urgent', 'ouverte', 'mécanique,urgence', 48.5734, 7.7521, datetime('now', '+2 days'), datetime('now', '-4 hours')),
('mission-5', 'user-5', 'Traduction document urgent', 'Document administratif anglais à traduire avant demain matin pour rendez-vous préfecture', 'administratif', 'ponctuel', 'urgent', 'ouverte', 'traduction,anglais', 48.8566, 2.3522, datetime('now', '+1 day'), datetime('now', '-5 hours')),
-- Missions moyennes
('mission-6', 'user-6', 'Cours informatique seniors', 'Grand-mère veut apprendre à utiliser son smartphone et envoyer emails', 'numerique', 'recurrent', 'moyen', 'ouverte', 'informatique,enseignement', 48.8566, 2.3522, datetime('now', '+30 days'), datetime('now', '-5 days')),
('mission-7', 'user-7', 'Garde enfants samedi soir', 'Besoin babysitter fiable pour 2 enfants (4 et 7 ans) samedi prochain 19h-23h', 'garde_enfants', 'ponctuel', 'moyen', 'ouverte', 'garde,enfants', 45.7640, 4.8357, datetime('now', '+14 days'), datetime('now', '-3 days')),
('mission-8', 'user-8', 'Covoiturage Paris-Lyon', 'Cherche covoiturage pour Lyon ce week-end, participation frais essence', 'transport', 'ponctuel', 'moyen', 'ouverte', 'transport,covoiturage', 43.2965, 5.3698, datetime('now', '+5 days'), datetime('now', '-1 day')),
('mission-9', 'user-9', 'Aide jardinage printemps', 'Besoin aide pour préparer potager : bêchage, semis, installation serre', 'jardinage', 'ponctuel', 'moyen', 'ouverte', 'jardinage,extérieur', 48.5734, 7.7521, datetime('now', '+21 days'), datetime('now', '-6 days')),
('mission-10', 'user-10', 'Cours de guitare débutant', 'Cherche prof guitare patient pour apprendre les bases, 1h/semaine', 'loisirs', 'recurrent', 'moyen', 'ouverte', 'musique,guitare', 48.8566, 2.3522, datetime('now', '+60 days'), datetime('now', '-8 days')),
('mission-11', 'user-1', 'Aide rédaction CV', 'Besoin aide pour rédiger CV et lettre motivation pour candidature emploi', 'administratif', 'ponctuel', 'moyen', 'ouverte', 'emploi,rédaction', 45.7640, 4.8357, datetime('now', '+10 days'), datetime('now', '-2 days')),
('mission-12', 'user-2', 'Montage meuble Ikea', 'Besoin aide montage armoire Pax 3 portes, j''ai les outils mais pas le courage', 'bricolage', 'ponctuel', 'moyen', 'ouverte', 'montage,bricolage', 43.2965, 5.3698, datetime('now', '+7 days'), datetime('now', '-4 days')),
('mission-13', 'user-3', 'Aide démarches administratives', 'Besoin accompagnement pour remplir dossier CAF, c''est compliqué', 'administratif', 'ponctuel', 'moyen', 'ouverte', 'administratif,social', 48.5734, 7.7521, datetime('now', '+15 days'), datetime('now', '-1 day')),
('mission-14', 'user-4', 'Cours de français FLE', 'Nouvel arrivant cherche cours français conversation, niveau débutant', 'education', 'recurrent', 'moyen', 'ouverte', 'langues,français', 48.8566, 2.3522, datetime('now', '+90 days'), datetime('now', '-7 days')),
('mission-15', 'user-5', 'Réparation vélo', 'Mon vélo a la chaîne qui saute et frein arrière ne marche plus', 'transport', 'ponctuel', 'moyen', 'ouverte', 'vélo,réparation', 45.7640, 4.8357, datetime('now', '+10 days'), datetime('now', '-3 days')),
('mission-16', 'user-6', 'Aide déclaration impôts', 'Première déclaration impôts, besoin aide pour comprendre formulaire en ligne', 'administratif', 'ponctuel', 'moyen', 'ouverte', 'impôts,administratif', 43.2965, 5.3698, datetime('now', '+30 days'), datetime('now', '-10 days')),
('mission-17', 'user-7', 'Cours couture débutant', 'Envie apprendre coudre pour réparer vêtements et créer petits projets', 'loisirs', 'recurrent', 'moyen', 'ouverte', 'couture,créatif', 48.5734, 7.7521, datetime('now', '+60 days'), datetime('now', '-5 days')),
('mission-18', 'user-8', 'Installation borne WiFi', 'Besoin aide installation répéteur WiFi et configuration réseau maison', 'numerique', 'ponctuel', 'moyen', 'ouverte', 'informatique,réseau', 48.8566, 2.3522, datetime('now', '+14 days'), datetime('now', '-2 days')),
('mission-19', 'user-9', 'Promener chien régulièrement', 'Cherche personne pour promener mon labrador 3x/semaine pendant mes horaires travail', 'animaux', 'recurrent', 'moyen', 'ouverte', 'animaux,chien', 45.7640, 4.8357, datetime('now', '+90 days'), datetime('now', '-12 days')),
('mission-20', 'user-10', 'Aide rangement garage', 'Besoin aide pour trier et ranger garage encombré, objets lourds à déplacer', 'bricolage', 'ponctuel', 'moyen', 'ouverte', 'rangement,force', 43.2965, 5.3698, datetime('now', '+21 days'), datetime('now', '-6 days')),
-- Missions faible urgence
('mission-21', 'user-1', 'Conversation anglais', 'Cherche personne anglophone pour pratiquer conversation 1h/semaine', 'education', 'recurrent', 'faible', 'ouverte', 'langues,anglais', 48.5734, 7.7521, datetime('now', '+90 days'), datetime('now', '-15 days')),
('mission-22', 'user-2', 'Initiation photographie', 'Envie apprendre bases photographie numérique et retouche photos', 'loisirs', 'recurrent', 'faible', 'ouverte', 'photo,créatif', 48.8566, 2.3522, datetime('now', '+60 days'), datetime('now', '-20 days')),
('mission-23', 'user-3', 'Cours yoga débutant', 'Recherche personne pour m''initier au yoga, séances douces pour débuter', 'sante', 'recurrent', 'faible', 'ouverte', 'yoga,bien-être', 45.7640, 4.8357, datetime('now', '+90 days'), datetime('now', '-8 days')),
('mission-24', 'user-4', 'Partenaire jogging', 'Cherche partenaire course à pied 2-3x/semaine niveau débutant', 'sport', 'recurrent', 'faible', 'ouverte', 'sport,course', 43.2965, 5.3698, datetime('now', '+90 days'), datetime('now', '-10 days')),
('mission-25', 'user-5', 'Échange garde enfants', 'Maman solo cherche système échange garde enfants avec autre parent', 'garde_enfants', 'recurrent', 'faible', 'ouverte', 'garde,échange', 48.5734, 7.7521, datetime('now', '+180 days'), datetime('now', '-25 days')),
('mission-26', 'user-6', 'Atelier cuisine végétarienne', 'Envie découvrir recettes végétariennes équilibrées et faciles', 'alimentation', 'recurrent', 'faible', 'ouverte', 'cuisine,végétarien', 48.8566, 2.3522, datetime('now', '+60 days'), datetime('now', '-14 days')),
('mission-27', 'user-7', 'Troc vêtements enfants', 'Organisation troc vêtements enfants 0-10 ans quartier', 'autre', 'ponctuel', 'faible', 'ouverte', 'vêtements,échange', 45.7640, 4.8357, datetime('now', '+45 days'), datetime('now', '-30 days')),
('mission-28', 'user-8', 'Cours échecs débutant', 'Cherche personne pour apprendre à jouer aux échecs', 'loisirs', 'recurrent', 'faible', 'ouverte', 'jeux,échecs', 43.2965, 5.3698, datetime('now', '+90 days'), datetime('now', '-18 days')),
('mission-29', 'user-9', 'Initiation poterie', 'Envie découvrir poterie et céramique, niveau grand débutant', 'loisirs', 'recurrent', 'faible', 'ouverte', 'poterie,créatif', 48.5734, 7.7521, datetime('now', '+90 days'), datetime('now', '-22 days')),
('mission-30', 'user-10', 'Visite musées ensemble', 'Cherche personne pour visiter musées et expos, partager passion art', 'culture', 'recurrent', 'faible', 'ouverte', 'culture,musée', 48.8566, 2.3522, datetime('now', '+120 days'), datetime('now', '-12 days')),
-- Missions variées supplémentaires
('mission-31', 'user-1', 'Aide préparation mariage', 'Besoin aide pour préparer décoration salle et mise en place jour J', 'autre', 'ponctuel', 'moyen', 'ouverte', 'événement,décoration', 45.7640, 4.8357, datetime('now', '+60 days'), datetime('now', '-5 days')),
('mission-32', 'user-2', 'Tonte pelouse régulière', 'Cherche personne pour tondre pelouse 2x/mois avril à octobre', 'jardinage', 'recurrent', 'moyen', 'ouverte', 'jardinage,tonte', 43.2965, 5.3698, datetime('now', '+120 days'), datetime('now', '-8 days')),
('mission-33', 'user-3', 'Soutien scolaire maths', 'Fils en 4ème besoin aide maths 2h/semaine pour combler lacunes', 'education', 'recurrent', 'moyen', 'ouverte', 'soutien,mathématiques', 48.5734, 7.7521, datetime('now', '+90 days'), datetime('now', '-11 days')),
('mission-34', 'user-4', 'Réparation volet roulant', 'Volet roulant cuisine bloqué en position basse, mécanisme cassé', 'bricolage', 'ponctuel', 'moyen', 'ouverte', 'bricolage,volet', 48.8566, 2.3522, datetime('now', '+14 days'), datetime('now', '-4 days')),
('mission-35', 'user-5', 'Garde chat vacances', 'Cherche personne pour nourrir chat 2x/jour pendant vacances été 2 semaines', 'animaux', 'ponctuel', 'moyen', 'ouverte', 'animaux,chat', 45.7640, 4.8357, datetime('now', '+120 days'), datetime('now', '-20 days')),
('mission-36', 'user-6', 'Cours piano adulte', 'Débutant complet cherche cours piano, envie jouer morceaux classiques', 'loisirs', 'recurrent', 'faible', 'ouverte', 'musique,piano', 43.2965, 5.3698, datetime('now', '+90 days'), datetime('now', '-15 days')),
('mission-37', 'user-7', 'Aide déménagement boxes', 'Besoin transport 20 cartons de box vers appartement, pas lourd mais volumineux', 'demenagement', 'ponctuel', 'moyen', 'ouverte', 'transport,cartons', 48.5734, 7.7521, datetime('now', '+10 days'), datetime('now', '-3 days')),
('mission-38', 'user-8', 'Installation stores intérieurs', 'Achat stores neufs, besoin aide installation 3 fenêtres avec perçage', 'bricolage', 'ponctuel', 'moyen', 'ouverte', 'bricolage,installation', 48.8566, 2.3522, datetime('now', '+21 days'), datetime('now', '-7 days')),
('mission-39', 'user-9', 'Cours espagnol conversation', 'Niveau intermédiaire cherche conversation espagnol 1h/semaine', 'education', 'recurrent', 'faible', 'ouverte', 'langues,espagnol', 45.7640, 4.8357, datetime('now', '+90 days'), datetime('now', '-18 days')),
('mission-40', 'user-10', 'Dépannage imprimante', 'Imprimante HP ne veut plus imprimer en couleur, besoin diagnostic', 'numerique', 'ponctuel', 'moyen', 'ouverte', 'informatique,imprimante', 43.2965, 5.3698, datetime('now', '+7 days'), datetime('now', '-2 days')),
('mission-41', 'user-1', 'Relecture mémoire', 'Besoin relecture orthographe et syntaxe mémoire master 80 pages', 'education', 'ponctuel', 'moyen', 'ouverte', 'correction,français', 48.5734, 7.7521, datetime('now', '+21 days'), datetime('now', '-9 days')),
('mission-42', 'user-2', 'Cours ukulélé débutant', 'Envie apprendre ukulélé, instrument acheté mais besoin bases', 'loisirs', 'recurrent', 'faible', 'ouverte', 'musique,ukulélé', 48.8566, 2.3522, datetime('now', '+60 days'), datetime('now', '-12 days')),
('mission-43', 'user-3', 'Aide création site web', 'Besoin aide créer site vitrine simple pour micro-entreprise', 'numerique', 'ponctuel', 'moyen', 'ouverte', 'web,création', 45.7640, 4.8357, datetime('now', '+30 days'), datetime('now', '-6 days')),
('mission-44', 'user-4', 'Transport meubles occasion', 'Achat canapé Le Bon Coin, besoin transport sur 15km', 'transport', 'ponctuel', 'moyen', 'ouverte', 'transport,meubles', 43.2965, 5.3698, datetime('now', '+7 days'), datetime('now', '-1 day')),
('mission-45', 'user-5', 'Initiation méditation', 'Cherche introduction méditation pleine conscience pour stress', 'sante', 'recurrent', 'faible', 'ouverte', 'bien-être,méditation', 48.5734, 7.7521, datetime('now', '+90 days'), datetime('now', '-16 days')),
('mission-46', 'user-6', 'Réparation parquet qui grince', 'Parquet chambre grince beaucoup la nuit, besoin diagnostic et réparation', 'bricolage', 'ponctuel', 'moyen', 'ouverte', 'bricolage,parquet', 48.8566, 2.3522, datetime('now', '+21 days'), datetime('now', '-10 days')),
('mission-47', 'user-7', 'Cours dessin adulte', 'Débutant total cherche cours dessin crayon/fusain', 'loisirs', 'recurrent', 'faible', 'ouverte', 'dessin,créatif', 45.7640, 4.8357, datetime('now', '+90 days'), datetime('now', '-14 days')),
('mission-48', 'user-8', 'Aide débroussaillage jardin', 'Jardin envahi ronces et mauvaises herbes, besoin gros coup main', 'jardinage', 'ponctuel', 'moyen', 'ouverte', 'jardinage,débroussaillage', 43.2965, 5.3698, datetime('now', '+30 days'), datetime('now', '-8 days')),
('mission-49', 'user-9', 'Installation lave-vaisselle', 'Achat lave-vaisselle neuf, besoin branchement plomberie et électrique', 'bricolage', 'ponctuel', 'moyen', 'ouverte', 'plomberie,installation', 48.5734, 7.7521, datetime('now', '+14 days'), datetime('now', '-3 days')),
('mission-50', 'user-10', 'Cours italien débutant', 'Projet voyage Italie, envie apprendre bases italien', 'education', 'recurrent', 'faible', 'ouverte', 'langues,italien', 48.8566, 2.3522, datetime('now', '+90 days'), datetime('now', '-17 days')),
('mission-51', 'user-1', 'Aide préparation Pâques', 'Organisation chasse œufs Pâques 20 enfants, besoin aide logistique', 'autre', 'ponctuel', 'moyen', 'ouverte', 'événement,enfants', 45.7640, 4.8357, datetime('now', '+30 days'), datetime('now', '-12 days')),
('mission-52', 'user-2', 'Cours informatique tablette', 'Senior veut apprendre utiliser iPad pour vidéos famille', 'numerique', 'recurrent', 'faible', 'ouverte', 'informatique,tablette', 43.2965, 5.3698, datetime('now', '+60 days'), datetime('now', '-19 days')),
('mission-53', 'user-3', 'Réparation serrure porte', 'Serrure porte entrée coincée, clé tourne mal', 'bricolage', 'ponctuel', 'moyen', 'ouverte', 'serrurerie,porte', 48.5734, 7.7521, datetime('now', '+7 days'), datetime('now', '-2 days')),
('mission-54', 'user-4', 'Partenaire badminton', 'Cherche partenaire badminton niveau loisir 1x/semaine', 'sport', 'recurrent', 'faible', 'ouverte', 'sport,badminton', 48.8566, 2.3522, datetime('now', '+90 days'), datetime('now', '-21 days')),
('mission-55', 'user-5', 'Installation étagères murales', 'Achat étagères Ikea, besoin perçage mur béton et fixation', 'bricolage', 'ponctuel', 'moyen', 'ouverte', 'bricolage,perçage', 45.7640, 4.8357, datetime('now', '+14 days'), datetime('now', '-5 days'));

-- Offers (35+ offers)
INSERT INTO offers (id, creatorId, title, description, category, offerType, tags, locationLat, locationLng, expiresAt, createdAt) VALUES
-- Services bricolage/technique
('offer-1', 'user-6', 'Travaux électriques', 'Électricien professionnel propose services pour petits travaux : prises, interrupteurs, luminaires', 'bricolage', 'service', 'électricité,bricolage', 48.8566, 2.3522, datetime('now', '+90 days'), datetime('now', '-10 days')),
('offer-2', 'user-2', 'Plomberie et sanitaire', 'Plombier retraité propose dépannage plomberie : fuites, robinets, chasse d''eau', 'bricolage', 'service', 'plomberie,réparation', 45.7640, 4.8357, datetime('now', '+90 days'), datetime('now', '-15 days')),
('offer-3', 'user-6', 'Menuiserie sur mesure', 'Menuisier propose création étagères, meubles sur mesure, réparations bois', 'bricolage', 'service', 'menuiserie,bois', 43.2965, 5.3698, datetime('now', '+120 days'), datetime('now', '-20 days')),
('offer-4', 'user-2', 'Peinture intérieure', 'Peintre propose services peinture appartements, conseils couleurs inclus', 'bricolage', 'service', 'peinture,décoration', 48.5734, 7.7521, datetime('now', '+90 days'), datetime('now', '-12 days')),
('offer-5', 'user-6', 'Réparation petits électroménagers', 'Technicien répare grille-pain, cafetières, aspirateurs, etc. à domicile', 'bricolage', 'service', 'réparation,électroménager', 48.8566, 2.3522, datetime('now', '+90 days'), datetime('now', '-18 days')),
-- Services éducation/langues
('offer-6', 'user-7', 'Cours français langue étrangère', 'Professeure certifiée donne cours français pour étrangers, tous niveaux', 'education', 'service', 'langues,enseignement', 45.7640, 4.8357, datetime('now', '+90 days'), datetime('now', '-15 days')),
('offer-7', 'user-8', 'Cours anglais conversation', 'Native speaker propose conversation anglais tous niveaux', 'education', 'service', 'langues,anglais', 43.2965, 5.3698, datetime('now', '+120 days'), datetime('now', '-25 days')),
('offer-8', 'user-1', 'Soutien scolaire maths-physique', 'Ingénieur retraité donne cours particuliers collège-lycée', 'education', 'service', 'soutien,sciences', 48.5734, 7.7521, datetime('now', '+90 days'), datetime('now', '-30 days')),
('offer-9', 'user-4', 'Cours programmation débutants', 'Développeur enseigne Python/JavaScript aux débutants tous âges', 'numerique', 'service', 'programmation,code', 48.8566, 2.3522, datetime('now', '+120 days'), datetime('now', '-22 days')),
('offer-10', 'user-7', 'Aide aux devoirs primaire', 'Étudiante propose aide devoirs enfants primaire toutes matières', 'education', 'service', 'soutien,primaire', 45.7640, 4.8357, datetime('now', '+90 days'), datetime('now', '-14 days')),
-- Services informatique/numérique
('offer-11', 'user-9', 'Dépannage informatique domicile', 'Technicien informatique : PC, Mac, virus, installation, configuration', 'numerique', 'service', 'informatique,dépannage', 48.5734, 7.7521, datetime('now', '+90 days'), datetime('now', '-8 days')),
('offer-12', 'user-8', 'Cours informatique seniors', 'Patient et pédagogue, j''aide seniors avec ordinateur, tablette, smartphone', 'numerique', 'service', 'informatique,seniors', 43.2965, 5.3698, datetime('now', '+120 days'), datetime('now', '-28 days')),
('offer-13', 'user-4', 'Création site web vitrine', 'Développeur web crée sites vitrines pour TPE/artisans tarifs solidaires', 'numerique', 'service', 'web,création', 48.8566, 2.3522, datetime('now', '+90 days'), datetime('now', '-16 days')),
('offer-14', 'user-9', 'Installation réseaux WiFi', 'Configuration box internet, répéteurs WiFi, optimisation réseau maison', 'numerique', 'service', 'réseau,wifi', 45.7640, 4.8357, datetime('now', '+90 days'), datetime('now', '-11 days')),
-- Services transport/déménagement
('offer-15', 'user-8', 'Camionnette pour déménagement', 'Prête camionnette week-ends pour déménagements (essence à charge)', 'demenagement', 'materiel', 'transport,camionnette', 43.2965, 5.3698, datetime('now', '+90 days'), datetime('now', '-20 days')),
('offer-16', 'user-10', 'Aide déménagement force', 'Sportif propose aide déménagement, port cartons, démontage meubles', 'demenagement', 'service', 'déménagement,manutention', 48.5734, 7.7521, datetime('now', '+90 days'), datetime('now', '-13 days')),
('offer-17', 'user-10', 'Remorque disponible', 'Prête remorque (charge max 500kg) pour transports ponctuels', 'transport', 'materiel', 'remorque,transport', 48.8566, 2.3522, datetime('now', '+120 days'), datetime('now', '-24 days')),
('offer-18', 'user-10', 'Covoiturage régulier Paris-Lyon', 'Trajet Paris-Lyon 1x/mois, places disponibles, partage frais', 'transport', 'service', 'covoiturage,longue-distance', 45.7640, 4.8357, datetime('now', '+180 days'), datetime('now', '-35 days')),
-- Services alimentation/cuisine
('offer-19', 'user-10', 'Cours cuisine végétarienne', 'Chef végétarien partage recettes et techniques, cours individuels/collectifs', 'alimentation', 'service', 'cuisine,végétarien', 48.8566, 2.3522, datetime('now', '+90 days'), datetime('now', '-12 days')),
('offer-20', 'user-3', 'Cours pâtisserie maison', 'Pâtissière amateure enseigne recettes pâtisserie traditionnelle française', 'alimentation', 'service', 'pâtisserie,cuisine', 43.2965, 5.3698, datetime('now', '+90 days'), datetime('now', '-26 days')),
('offer-21', 'user-3', 'Initiation conserves maison', 'J''enseigne techniques conserves fruits/légumes, confitures, bocaux', 'alimentation', 'service', 'conserves,cuisine', 48.5734, 7.7521, datetime('now', '+120 days'), datetime('now', '-19 days')),
-- Services loisirs/créatifs
('offer-22', 'user-9', 'Cours couture tous niveaux', 'Couturière donne cours couture : réparations, créations, patron', 'loisirs', 'service', 'couture,créatif', 48.8566, 2.3522, datetime('now', '+90 days'), datetime('now', '-17 days')),
('offer-23', 'user-7', 'Atelier peinture aquarelle', 'Artiste peintre propose initiation aquarelle en petits groupes', 'loisirs', 'service', 'peinture,art', 45.7640, 4.8357, datetime('now', '+120 days'), datetime('now', '-21 days')),
('offer-24', 'user-1', 'Cours photographie débutant', 'Photographe amateur partage bases photo numérique et composition', 'loisirs', 'service', 'photographie,créatif', 43.2965, 5.3698, datetime('now', '+90 days'), datetime('now', '-23 days')),
('offer-25', 'user-9', 'Initiation tricot crochet', 'Grand-mère patiente enseigne tricot et crochet aux débutants', 'loisirs', 'service', 'tricot,créatif', 48.5734, 7.7521, datetime('now', '+120 days'), datetime('now', '-27 days')),
-- Services musique
('offer-26', 'user-9', 'Cours guitare acoustique', 'Guitariste donne cours débutants/intermédiaires, folk et classique', 'loisirs', 'service', 'musique,guitare', 48.8566, 2.3522, datetime('now', '+90 days'), datetime('now', '-29 days')),
('offer-27', 'user-7', 'Cours piano classique', 'Pianiste diplômée conservatoire propose cours enfants/adultes', 'loisirs', 'service', 'musique,piano', 45.7640, 4.8357, datetime('now', '+120 days'), datetime('now', '-31 days')),
-- Services jardinage/extérieur
('offer-28', 'user-3', 'Conseils jardinage potager', 'Jardinier bio partage conseils potager, permaculture, compost', 'jardinage', 'service', 'jardinage,potager', 43.2965, 5.3698, datetime('now', '+120 days'), datetime('now', '-33 days')),
('offer-29', 'user-6', 'Taille haies et arbustes', 'Jardinier propose taille haies, arbustes, petit élagage', 'jardinage', 'service', 'jardinage,taille', 48.5734, 7.7521, datetime('now', '+90 days'), datetime('now', '-15 days')),
('offer-30', 'user-3', 'Tonte pelouse et entretien', 'Service tonte pelouse régulière, désherbage, entretien jardin', 'jardinage', 'service', 'jardinage,entretien', 48.8566, 2.3522, datetime('now', '+180 days'), datetime('now', '-37 days')),
-- Services animaux
('offer-31', 'user-5', 'Garde animaux domicile', 'Pet-sitter garde chiens/chats à domicile pendant absences', 'animaux', 'service', 'animaux,garde', 45.7640, 4.8357, datetime('now', '+180 days'), datetime('now', '-40 days')),
('offer-32', 'user-5', 'Promenade chiens', 'Amoureux animaux propose promenades chiens quotidiennes quartier', 'animaux', 'service', 'animaux,promenade', 43.2965, 5.3698, datetime('now', '+120 days'), datetime('now', '-32 days')),
-- Services bien-être/sport
('offer-33', 'user-7', 'Cours yoga doux', 'Professeure yoga certifiée propose séances douces tous niveaux', 'sante', 'service', 'yoga,bien-être', 48.5734, 7.7521, datetime('now', '+90 days'), datetime('now', '-34 days')),
('offer-34', 'user-10', 'Coaching course à pied', 'Coureur expérimenté accompagne débutants, plans entraînement personnalisés', 'sport', 'service', 'sport,running', 48.8566, 2.3522, datetime('now', '+120 days'), datetime('now', '-36 days')),
-- Matériel/prêt
('offer-35', 'user-2', 'Prêt outils bricolage', 'Perceuse, scie, ponceuse, échelle disponibles en prêt gratuit', 'bricolage', 'materiel', 'outils,prêt', 45.7640, 4.8357, datetime('now', '+180 days'), datetime('now', '-42 days'));

-- Contributions (missions have contributions)
INSERT INTO contributions (id, userId, missionId, type, message, status, createdAt) VALUES
('contrib-1', 'user-10', 'mission-1', 'help', 'Je peux aider pour le déménagement, j ai une voiture spacieuse. Disponible samedi matin', 'active', datetime('now', '-1 day')),
('contrib-2', 'user-6', 'mission-2', 'help', 'Plombier amateur, je peux passer voir la fuite demain. Disponible demain après-midi', 'active', datetime('now', '-6 hours')),
('contrib-3', 'user-8', 'mission-6', 'help', 'Je peux aider votre grand-mère avec son smartphone, j ai l habitude avec les seniors', 'active', datetime('now', '-3 days')),
('contrib-4', 'user-7', 'mission-7', 'help', 'Étudiante en éducation, j adore les enfants, disponible samedi soir', 'active', datetime('now', '-2 days')),
('contrib-5', 'user-4', 'mission-11', 'help', 'RH de métier, je peux relire et améliorer votre CV avec plaisir', 'active', datetime('now', '-1 day')),
('contrib-6', 'user-9', 'mission-12', 'help', 'Expert montage Ikea (malheureusement), je peux venir avec mes outils', 'active', datetime('now', '-3 days')),
('contrib-7', 'user-10', 'mission-15', 'help', 'Mécanicien vélo amateur, je peux diagnostiquer et réparer', 'active', datetime('now', '-2 days')),
('contrib-8', 'user-3', 'mission-19', 'help', 'J adore les labradors, je promène déjà 2 chiens du quartier', 'active', datetime('now', '-5 days')),
('contrib-9', 'user-8', 'mission-18', 'help', 'Admin réseau de profession, installation WiFi c est mon quotidien', 'active', datetime('now', '-1 day')),
('contrib-10', 'user-6', 'mission-34', 'help', 'J ai déjà réparé 3 volets roulants dans l immeuble, je connais bien', 'active', datetime('now', '-3 days'));

-- Correlations (matches between missions and offers - AI matching scores)
INSERT INTO correlations (id, missionId, offerId, score, createdAt) VALUES
-- Déménagement
('corr-1', 'mission-1', 'offer-15', 95, datetime('now', '-1 day')),
('corr-2', 'mission-1', 'offer-16', 88, datetime('now', '-1 day')),
('corr-3', 'mission-37', 'offer-15', 92, datetime('now', '-2 days')),
('corr-4', 'mission-37', 'offer-16', 85, datetime('now', '-2 days')),
('corr-5', 'mission-44', 'offer-15', 90, datetime('now', '-1 day')),
('corr-6', 'mission-44', 'offer-17', 82, datetime('now', '-1 day')),
-- Bricolage/plomberie
('corr-7', 'mission-2', 'offer-2', 93, datetime('now', '-1 day')),
('corr-8', 'mission-2', 'offer-1', 72, datetime('now', '-1 day')),
('corr-9', 'mission-34', 'offer-1', 88, datetime('now', '-3 days')),
('corr-10', 'mission-49', 'offer-2', 95, datetime('now', '-2 days')),
('corr-11', 'mission-53', 'offer-2', 78, datetime('now', '-1 day')),
('corr-12', 'mission-46', 'offer-3', 85, datetime('now', '-8 days')),
('corr-13', 'mission-12', 'offer-35', 70, datetime('now', '-3 days')),
('corr-14', 'mission-38', 'offer-1', 80, datetime('now', '-5 days')),
('corr-15', 'mission-55', 'offer-35', 75, datetime('now', '-4 days')),
-- Informatique/numérique
('corr-16', 'mission-6', 'offer-11', 90, datetime('now', '-4 days')),
('corr-17', 'mission-6', 'offer-12', 95, datetime('now', '-4 days')),
('corr-18', 'mission-18', 'offer-11', 92, datetime('now', '-1 day')),
('corr-19', 'mission-18', 'offer-14', 98, datetime('now', '-1 day')),
('corr-20', 'mission-40', 'offer-11', 88, datetime('now', '-1 day')),
('corr-21', 'mission-43', 'offer-13', 96, datetime('now', '-5 days')),
('corr-22', 'mission-52', 'offer-12', 93, datetime('now', '-15 days')),
-- Éducation/langues
('corr-23', 'mission-14', 'offer-6', 97, datetime('now', '-6 days')),
('corr-24', 'mission-21', 'offer-7', 94, datetime('now', '-12 days')),
('corr-25', 'mission-39', 'offer-7', 75, datetime('now', '-14 days')),
('corr-26', 'mission-33', 'offer-8', 91, datetime('now', '-9 days')),
('corr-27', 'mission-41', 'offer-6', 80, datetime('now', '-7 days')),
('corr-28', 'mission-50', 'offer-6', 72, datetime('now', '-13 days')),
-- Garde/animaux
('corr-29', 'mission-7', 'offer-10', 85, datetime('now', '-2 days')),
('corr-30', 'mission-19', 'offer-32', 96, datetime('now', '-10 days')),
('corr-31', 'mission-35', 'offer-31', 98, datetime('now', '-18 days')),
-- Jardinage
('corr-32', 'mission-9', 'offer-28', 90, datetime('now', '-4 days')),
('corr-33', 'mission-32', 'offer-30', 94, datetime('now', '-6 days')),
('corr-34', 'mission-48', 'offer-29', 88, datetime('now', '-6 days')),
-- Cuisine/alimentation
('corr-35', 'mission-26', 'offer-19', 96, datetime('now', '-11 days')),
-- Loisirs/musique
('corr-36', 'mission-10', 'offer-26', 93, datetime('now', '-6 days')),
('corr-37', 'mission-36', 'offer-27', 95, datetime('now', '-12 days')),
('corr-38', 'mission-42', 'offer-26', 80, datetime('now', '-9 days')),
('corr-39', 'mission-17', 'offer-22', 92, datetime('now', '-4 days')),
('corr-40', 'mission-22', 'offer-24', 89, datetime('now', '-16 days')),
('corr-41', 'mission-47', 'offer-23', 91, datetime('now', '-11 days')),
-- Transport
('corr-42', 'mission-8', 'offer-18', 87, datetime('now', '-1 day')),
('corr-43', 'mission-15', 'offer-5', 70, datetime('now', '-2 days')),
-- Sport/bien-être
('corr-44', 'mission-23', 'offer-33', 97, datetime('now', '-6 days')),
('corr-45', 'mission-24', 'offer-34', 94, datetime('now', '-8 days')),
('corr-46', 'mission-45', 'offer-33', 88, datetime('now', '-13 days')),
('corr-47', 'mission-54', 'offer-34', 75, datetime('now', '-17 days'));

-- Summary
SELECT 'Data seeding completed!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_missions FROM missions;
SELECT COUNT(*) as total_offers FROM offers;
SELECT COUNT(*) as total_contributions FROM contributions;
SELECT COUNT(*) as total_correlations FROM correlations;
