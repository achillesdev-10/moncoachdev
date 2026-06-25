-- 1. Ajouter la colonne language à la table challenges
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'HTML';

-- 2. Injecter les nouveaux défis
INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES 
('L''Architecture de ton Portfolio', 'Structure la page d''accueil d''un dev avec les balises sémantiques (main, section, aside). C''est crucial pour le référencement à Abidjan !', 'Débutant', 80, 'algo', '<div>Contenu au hasard</div>', ARRAY['<main>', '<section>', '<header>'], 'HTML'),

('L''Effet Néon Abidjan Night', 'Donne un style ''Night Club'' à ce titre avec un text-shadow puissant et une bordure lumineuse.', 'Pilote', 150, 'pixel_perfect', '<h1 style="color:white;">AKWABA</h1>', ARRAY['text-shadow', 'box-shadow', 'border'], 'CSS'),

('Le Calculateur de Pourboire', 'Écris une fonction qui prend un montant et ajoute 10% de pourboire automatiquement. Affiche le résultat final.', 'Pilote', 200, 'algo', '<script>let prix = 1000; // Calcule ici</script>', ARRAY['* 1.1', 'Math.round'], 'JS'),

('Le Guichet Automatique de la Banque', 'Un client veut retirer 35 000 FCFA. Écris une fonction qui calcule combien de billets de 10 000 il reçoit (3) et quel est le reste (5 000).', 'Pilote', 250, 'algo', 'let retrait = 35000; // Calcule les billets ici', ARRAY['Math.floor', '/ 10000', '5000'], 'JS'),

('Le Radar de Mission', 'Crée un cercle qui pulse avec une ombre portée verte néon pour simuler un radar de cockpit.', 'Pilote', 180, 'pixel_perfect', '<div class="radar"></div>', ARRAY['@keyframes', 'scale', 'infinite'], 'CSS'),

('Le Dossier du Pilote', 'Crée un formulaire de contact incluant un champ pour le nom, l''email et un bouton d''envoi. Utilise les bons attributs ''type''.', 'Apprenti', 100, 'algo', '<form></form>', ARRAY['type="email"', 'type="submit"', '<input'], 'HTML'),

('Le Formulaire de Commande Mobile Money', 'Crée la structure d''un formulaire pour un transfert. Il faut un champ ''Numéro du destinataire'', un champ ''Montant'' et une liste déroulante pour choisir l''opérateur (Orange, Wave, MTN).', 'Apprenti', 120, 'algo', '<form> </form>', ARRAY['<select>', '<option>', 'type="number"'], 'HTML'),

('Le Badge de Notification', 'Ajoute un petit badge rouge avec le chiffre ''3'' en haut à droite de l''icône de profil. Utilise ''position: absolute''.', 'Débutant', 100, 'pixel_perfect', '<div style="position:relative; width:50px; height:50px; background:gray;"> <div class="badge">3</div> </div>', ARRAY['position: absolute', 'top:', 'right:', 'border-radius: 50%'], 'CSS'),

('Le Générateur de Code de Validation', 'Écris une fonction qui génère un code de validation aléatoire de 4 chiffres (ex: 4509) pour confirmer une transaction.', 'Pilote', 220, 'algo', 'function generateOTP() { // Ton code ici }', ARRAY['Math.random', 'Math.floor', '* 9000'], 'JS'),

('La Recherche Rapide', 'Fais en sorte que si on tape dans un input, cela affiche ''Recherche en cours...'' uniquement si le texte fait plus de 3 caractères.', 'Expert', 300, 'algo', '<input type="text" oninput="checkSearch(this.value)"> <p id="status"></p>', ARRAY['.length > 3', 'innerText', 'value'], 'JS'),

('L''Ambiance Visuelle (Video Hero)', 'Le client veut une vidéo en fond de page. Ajoute une balise vidéo avec les attributs pour qu''elle soit en boucle (loop), sans son (muted) et qu''elle se lance seule (autoplay).', 'Pilote', 130, 'algo', '<section></section>', ARRAY['autoplay', 'muted', 'loop', '<video'], 'HTML'),

('L''Effet Glassmorphism', 'Crée l''effet tendance : un fond semi-transparent avec un flou d''arrière-plan de 10px. C''est le style futuriste par excellence !', 'Expert', 180, 'pixel_perfect', '<div style="background: rgba(255,255,255,0.2); width:300px; height:200px;"></div>', ARRAY['backdrop-filter: blur(10px)', 'border: 1px solid rgba'], 'CSS'),

('Le Moteur de Recherche Interne', 'Cache les éléments d''une liste qui ne contiennent pas la lettre ''a''. Utilise ''.includes()'' et ''style.display = ''''none''''''.', 'Pilote', 250, 'algo', '<ul><li>Orange</li><li>Banane</li><li>Kiwi</li></ul>', ARRAY['display = ''none''', 'includes(''a'')', '.forEach'], 'JS'),

('L''Autodestruction (Timer)', 'Crée un compte à rebours de 5 à 0. Quand il arrive à 0, affiche ''BOOM'' dans la console. Utilise ''setInterval''.', 'Expert', 350, 'algo', 'let compte = 5;', ARRAY['setInterval', 'clearInterval', '=== 0'], 'JS'),

('Le Menu Burger Mobile', 'Crée un menu qui s''empile verticalement sur les écrans de moins de 768px. Utilise les Media Queries (@media).', 'Pilote', 150, 'pixel_perfect', '<nav class="menu"><a>Accueil</a><a>Défis</a></nav>', ARRAY['@media', 'flex-direction: column', '768px'], 'CSS'),

('La Grille de Produits (Grid)', 'Affiche 3 produits par ligne sur PC, mais seulement 1 par ligne sur téléphone. Utilise CSS Grid avec grid-template-columns.', 'Pilote', 200, 'pixel_perfect', '<div class="container"><div>P1</div><div>P2</div><div>P3</div></div>', ARRAY['display: grid', 'repeat(3, 1fr)', 'repeat(1, 1fr)'], 'CSS'),

('L''Effet ''Scroll to Top''', 'Crée un bouton qui n''apparaît que lorsqu''on a scrollé plus de 300px. Quand on clique, on remonte tout en haut en douceur.', 'Apprenti', 180, 'algo', '<button id="btnTop">Bas</button>', ARRAY['window.scrollY', 'window.scrollTo', 'behavior: ''smooth'''], 'JS'),

('Validation de Formulaire (Live)', 'Vérifie en temps réel si un mot de passe fait plus de 8 caractères. Affiche un message vert s''il est bon, rouge sinon.', 'Expert', 250, 'algo', '<input type="password" id="pass"> <p id="msg"></p>', ARRAY['input', '.value.length', 'color = ''red'''], 'JS'),

-- PACK ÉLITE 20
('Tableau de Prix (SaaS)', 'Structure un tableau de prix avec des colonnes pour ''Plan'', ''Prix'' et ''Bénéfices''. Utilise thead, tbody et tfoot.', 'Apprenti', 100, 'algo', '<table></table>', ARRAY['<thead>', '<tbody>', '<tfoot>', '<tr>', '<td>', '<th>'], 'HTML'),

('Validation de Commande Pagne', 'Crée un formulaire pour commander un pagne avec des champs obligatoires (required), un pattern pour le numéro de téléphone et une limite de caractères.', 'Apprenti', 120, 'algo', '<form></form>', ARRAY['required', 'pattern', 'minlength', 'maxlength'], 'HTML'),

('Localisation du QG MonCoachDev', 'Intègre une carte Google Maps dans ton site via une iframe avec une largeur de 100% et une hauteur de 450px.', 'Apprenti', 80, 'algo', '<div></div>', ARRAY['<iframe>', 'src="https://www.google.com/maps', 'width="100%"', 'height="450"'], 'HTML'),

('Structure d''Article de Blog (SEO)', 'Structure un article de blog avec les balises article, h1, header, section, et footer pour un meilleur référencement.', 'Pilote', 150, 'algo', '<div></div>', ARRAY['<article>', '<header>', '<footer>', '<section>', '<h1>'], 'HTML'),

('Alerte de Cookies (RGPD)', 'Crée la structure d''une barre de cookies avec un texte explicatif et deux boutons : ''Accepter'' et ''Paramètres''.', 'Pilote', 130, 'algo', '<div></div>', ARRAY['<aside>', '<p>', '<button>', 'role="dialog"'], 'HTML'),

('Glossaire Technique', 'Affiche une liste de définitions pour ''HTML'', ''CSS'' et ''JS'' en utilisant les balises dl, dt et dd.', 'Apprenti', 90, 'algo', '<dl></dl>', ARRAY['<dl>', '<dt>', '<dd>'], 'HTML'),

('Barre de Navigation Fixée (Sticky)', 'Fais en sorte que ta barre de navigation reste en haut de l''écran pendant le scroll. Utilise position: sticky.', 'Pilote', 140, 'pixel_perfect', '<nav></nav>', ARRAY['position: sticky', 'top: 0', 'z-index:'], 'CSS'),

('Carte de Pilote (Effet 3D)', 'Crée un effet de survol 3D sur une carte en utilisant transform: rotateY et perspective.', 'Expert', 250, 'pixel_perfect', '<div class="card"></div>', ARRAY['perspective:', 'transform:', 'rotateY(', 'transition:'], 'CSS'),

('Mise en page en Z (Z-Pattern)', 'Crée un layout alternant image et texte (Z-pattern) en utilisant flex-direction: row-reverse sur les lignes paires.', 'Pilote', 160, 'pixel_perfect', '<div class="container"><div class="row"></div><div class="row"></div></div>', ARRAY['display: flex', 'flex-direction: row-reverse', 'nth-child(even)'], 'CSS'),

('Bouton Futuriste (Néomorphisme)', 'Crée un bouton au style néomorphique avec des ombres internes et externes pour un effet de relief doux.', 'Expert', 220, 'pixel_perfect', '<button></button>', ARRAY['box-shadow:', 'inset', 'border-radius:'], 'CSS'),

('Bulle d''info (Tooltip) CSS', 'Crée une bulle d''info qui apparaît au survol d''un texte. Utilise les pseudo-éléments ::after ou ::before.', 'Pilote', 140, 'pixel_perfect', '<span class="tooltip">Survole-moi</span>', ARRAY['::after', 'content:', 'opacity:', 'visibility:', ':hover'], 'CSS'),

('Grille Asymétrique (Portfolio)', 'Crée une grille asymétrique avec CSS Grid où une colonne fait 2 parts et l''autre seulement 1 part.', 'Expert', 240, 'pixel_perfect', '<div class="grid"></div>', ARRAY['grid-template-columns: 2fr 1fr', 'display: grid'], 'CSS'),

('Galerie de Pagnes (Object-fit)', 'Assure-toi que toutes les images d''une galerie gardent leurs proportions sans être déformées, tout en remplissant leur conteneur.', 'Apprenti', 110, 'pixel_perfect', '<img src="pagne.jpg" style="width:200px; height:200px;">', ARRAY['object-fit: cover', 'width:', 'height:'], 'CSS'),

('Calcul de Remise (Fintech)', 'Écris un script qui calcule le prix final après une remise de 15%. Affiche le montant économisé.', 'Apprenti', 130, 'algo', '<script>let prix = 10000;</script>', ARRAY['* 0.15', '- remise', '.toFixed(2)'], 'JS'),

('Afficher le Mot de Passe', 'Crée un bouton qui change le type d''un champ input de ''password'' à ''text'' pour afficher le mot de passe.', 'Apprenti', 140, 'algo', '<input type="password" id="pass"><button>Voir</button>', ARRAY['type === ''password''', 'type = ''text''', '.getAttribute(''type'')'], 'JS'),

('Analyseur de Sécurité', 'Vérifie si un mot de passe contient au moins un chiffre et une majuscule. Affiche ''Fort'' ou ''Faible''.', 'Pilote', 210, 'algo', '<input type="text" id="pass">', ARRAY['/[A-Z]/', '/[0-9]/', '.test(', 'innerText'], 'JS'),

('Compteur de Caractères', 'Compte le nombre de caractères tapés dans un textarea et bloque à 280. Affiche le décompte en temps réel.', 'Apprenti', 120, 'algo', '<textarea id="tweet"></textarea><p id="count"></p>', ARRAY['.length', '280 -', 'oninput'], 'JS'),

('Convertisseur de Devises', 'Convertis un montant de FCFA en Euros (taux fixe : 655.95). Affiche le résultat avec 2 décimales.', 'Pilote', 180, 'algo', '<script>let fcfa = 10000;</script>', ARRAY['/ 655.95', '.toFixed(2)', 'parseFloat'], 'JS'),

('Salutation Automatique', 'Affiche ''Bonjour'' avant 18h et ''Bonsoir'' après 18h en utilisant l''objet Date de JavaScript.', 'Apprenti', 100, 'algo', '<h1 id="greet"></h1>', ARRAY['new Date()', '.getHours()', '< 18', 'innerText'], 'JS'),

('Sauvegarde de Favoris', 'Sauvegarde l''ID d''un défi dans le LocalStorage du navigateur quand on clique sur ''Favori''. Récupère-le au rechargement.', 'Expert', 300, 'algo', '<button id="fav">Favori</button>', ARRAY['localStorage.setItem(', 'localStorage.getItem(', 'JSON.stringify(', 'JSON.parse('], 'JS');