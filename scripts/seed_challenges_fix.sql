-- =====================================================
-- FIX: Allow authenticated users to insert challenges
-- (Fixes the RLS policy that blocks seed scripts)
-- =====================================================
DROP POLICY IF EXISTS "Seuls les admins peuvent modifier les défis" ON challenges;

-- Re-create with proper admin check + allow service_role for seeds
CREATE POLICY "Seuls les admins peuvent modifier les défis"
ON challenges FOR ALL
USING (
  auth.role() = 'service_role'
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

-- =====================================================
-- Seed: CSS Challenges
-- =====================================================
INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES
('Le Panier Fantôme de Marcory', 'Le bouton de paiement de la boutique "Yassir-Style" est passé sous le footer sur mobile ! Rends-le visible en utilisant les propriétés de profondeur (z-index).', 'Apprenti', 100, 'bug_hunter', '<div style="position:relative;"><footer style="position:fixed; bottom:0; width:100%; height:60px; background:black; z-index:10;"></footer><button style="position:fixed; bottom:10px; background:orange; z-index:1;">VALIDER LA COMMANDE</button></div>', ARRAY['z-index: 11', 'z-index: 20', 'z-index: 100', 'z-index:11', 'z-index:20', 'z-index:100'], 'CSS')
ON CONFLICT DO NOTHING;

INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES
('La Carte VIP Assinie', 'Intègre la carte de membre VIP du complexe hôtelier. Elle doit avoir un dégradé du bleu vers le vert et des bords très arrondis (24px).', 'Pilote', 250, 'pixel_perfect', '<div style="width:300px; height:180px; background:blue;">CARTE VIP</div>', ARRAY['border-radius: 24px', 'linear-gradient', 'border-radius:24px'], 'CSS')
ON CONFLICT DO NOTHING;

INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES
('L''Alerte Mobile Money', 'Urgent ! Sur l''interface de transfert de l''app "Ivoire-Pay", le badge "PROMO" chevauche le montant du solde. Utilise "margin-top" ou "position" pour le décaler de 20px vers le haut et libérer la vue.', 'Apprenti', 120, 'bug_hunter', '<div style="background:#eee; padding:20px;"><span style="background:red; color:white; padding:5px; position:absolute;">PROMO</span><h2 style="margin-top:0;">50.000 FCFA</h2></div>', ARRAY['margin-bottom: 20px', 'top: -20px', 'position: relative', 'margin-top: -20px'], 'CSS')
ON CONFLICT DO NOTHING;

INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES
('Le Header d''Assinie Beach', 'Le client veut un header élégant pour son site de luxe. Applique un flou d''arrière-plan (backdrop-filter) et une bordure basse subtile de 1px blanche semi-transparente pour un effet "glassmorphism".', 'Pilote', 200, 'pixel_perfect', '<nav style="height:60px; background: rgba(255,255,255,0.5);">Menu</nav>', ARRAY['backdrop-filter: blur', 'border-bottom', 'backdrop-filter:blur'], 'CSS')
ON CONFLICT DO NOTHING;

INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES
('La Carte Gnonmi & Lait', 'Design la carte produit ultime pour le nouveau resto tendance. Ajoute une ombre portée douce (box-shadow), une image arrondie et un bouton "Commander" qui change de taille au survol (scale) avec une transition fluide.', 'Expert', 300, 'pixel_perfect', '<div style="width:200px; border:1px solid #ccc;">Gnonmi Deluxe</div>', ARRAY['box-shadow', 'transition', 'transform: scale', 'transform:scale'], 'CSS')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Seed: JavaScript Challenges
-- =====================================================
INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES
('Le Formateur de Prix FCFA', 'Corrige l''affichage du prix. Le montant 2500.899999 doit devenir "2 501 FCFA". Utilise les arrondis.', 'Débutant', 150, 'algo', '<span>2500.899999</span>', ARRAY['2 501 FCFA', 'Math.round', 'fixed'], 'JavaScript')
ON CONFLICT DO NOTHING;

INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES
('Le Convertisseur d''Hectares', 'Une coopérative agricole à Yamoussoukro a besoin d''afficher ses surfaces. Convertis 15500 m² en hectares (1 ha = 10 000 m²) et affiche le résultat avec 2 décimales suivi de "ha".', 'Apprenti', 150, 'algo', '<div>15500</div>', ARRAY['1.55 ha', 'Math.round', 'toFixed'], 'JavaScript')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Seed: HTML Challenges (from insert_new_challenges.sql)
-- =====================================================
INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES
('Barre de navigation accessible', 'Crée une barre de navigation responsive avec un lien d''évitement (''skip to content'') pour améliorer l''accessibilité. Ajoute les attributs ARIA nécessaires et assure-toi que le menu est utilisable au clavier.', 'Débutant', 100, 'algo', '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Nav accessible</title>\n  <style>\n    /* Ton CSS ici */\n  </style>\n</head>\n<body>\n  <!-- Ajoute le lien d''évitement et la navigation -->\n  <main id="content">\n    <h1>Contenu principal</h1>\n    <p>Utilise Tab pour naviguer.</p>\n  </main>\n</body>\n</html>', ARRAY['aria-label', 'skip-link', '#content', 'nav', 'ul', 'li'], 'HTML')
ON CONFLICT DO NOTHING;

INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES
('Galerie d''images responsive avec figcaption', 'Construis une galerie d''images qui s''affiche en grille (3 colonnes sur desktop, 1 sur mobile). Chaque image doit avoir une légende descriptive via <figcaption>. Assure-toi que les images sont responsives (max-width:100%).', 'Débutant', 110, 'pixel_perfect', '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Galerie responsive</title>\n  <style>\n    /* Ton code CSS ici */\n  </style>\n</head>\n<body>\n  <figure class="gallery">\n    <!-- Ajoute au moins 3 figures avec image et figcaption -->\n  </figure>\n</body>\n</html>', ARRAY['display: grid', 'grid-template-columns', '<figcaption>', '<figure>', 'max-width: 100%'], 'HTML')
ON CONFLICT DO NOTHING;

INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES
('Article sémantique avec microdonnées', 'Rédige un article de blog structuré avec <article>, <header>, <section>. Ajoute des microdonnées Schema.org (itemscope, itemtype) pour le titre, l''auteur et la date de publication.', 'Apprenti', 150, 'algo', '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <title>Article sémantique</title>\n</head>\n<body>\n  <!-- Construis l''article ici -->\n</body>\n</html>', ARRAY['itemscope', 'itemtype', 'itemprop="headline"', 'itemprop="author"', 'datetime', '<article>'], 'HTML')
ON CONFLICT DO NOTHING;

INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES
('Formulaire accessible avec champs groupés', 'Crée un formulaire d''inscription avec groupement de champs (fieldset/legend), labels explicites, et attributs ARIA pour les messages d''erreur simulés.', 'Apprenti', 180, 'algo', '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <title>Formulaire accessible</title>\n</head>\n<body>\n  <form>\n    <!-- Ajoute les champs ici -->\n  </form>\n</body>\n</html>', ARRAY['<fieldset>', '<legend>', 'aria-required', 'aria-invalid', 'aria-live', 'required'], 'HTML')
ON CONFLICT DO NOTHING;

INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES
('Contrôles personnalisés pour lecteur vidéo', 'Implémente un lecteur vidéo HTML5 avec contrôles personnalisés (play/pause, volume, progression) entièrement accessibles au clavier et avec attributs ARIA. Cache les contrôles natifs.', 'Pilote', 250, 'algo', '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <title>Lecteur vidéo accessible</title>\n  <style>\n    .video-container { width: 640px; }\n    .controls { display: flex; gap: 10px; }\n  </style>\n</head>\n<body>\n  <div class="video-container">\n    <video id="video" src="https://www.w3schools.com/html/mov_bbb.mp4"></video>\n    <div class="controls" role="toolbar">\n      <button id="playPauseBtn">Play</button>\n      <input type="range" id="progress" value="0" step="0.01">\n      <input type="range" id="volume" min="0" max="1" step="0.01" value="0.5">\n    </div>\n  </div>\n  <script>\n    // Implémente la logique ici\n  </script>\n</body>\n</html>', ARRAY['video.play()', 'video.pause()', 'video.currentTime', 'video.volume', 'role="toolbar"', 'aria-label'], 'HTML')
ON CONFLICT DO NOTHING;

INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES
('Tableau responsive avec en-tête fixe', 'Crée un tableau de données large (au moins 6 colonnes) qui devient défilable horizontalement sur mobile. L''en-tête doit rester visible lors du défilement vertical (position: sticky).', 'Pilote', 220, 'pixel_perfect', '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Tableau responsive</title>\n  <style>\n    /* à compléter */\n  </style>\n</head>\n<body>\n  <div class="table-wrapper">\n    <table>\n      <!-- génère des données -->\n    </table>\n  </div>\n</body>\n</html>', ARRAY['overflow-x: auto', 'position: sticky', 'top: 0', 'border-collapse', 'min-width:'], 'HTML')
ON CONFLICT DO NOTHING;

INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES
('Carte SVG interactive avec info-bulle', 'Construis une carte SVG (par exemple régions) où chaque région affiche une infobulle personnalisée (tooltip) au survol et au focus, sans JavaScript (uniquement CSS et attributs title/aria-describedby).', 'Pilote', 280, 'pixel_perfect', '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <title>Carte interactive</title>\n  <style>\n    /* styles pour tooltip */\n  </style>\n</head>\n<body>\n  <svg viewBox="0 0 200 200" role="img" aria-label="Carte des régions">\n    <!-- Dessine des polygones -->\n  </svg>\n</body>\n</html>', ARRAY['<svg>', '<polygon>', 'tabindex="0"', 'aria-describedby', 'role="tooltip"', ':hover', ':focus'], 'HTML')
ON CONFLICT DO NOTHING;
