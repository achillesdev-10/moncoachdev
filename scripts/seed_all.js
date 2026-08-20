const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Variables manquantes dans .env.local :');
  if (!supabaseUrl) console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  if (!serviceRoleKey) console.error('   - SUPABASE_SERVICE_ROLE_KEY (Settings > API > service_role)');
  process.exit(1);
}

// Utiliser la service_role key pour bypasser RLS
const supabase = createClient(supabaseUrl, serviceRoleKey);

const allChallenges = [
  // =====================================================
  // HTML Challenges
  // =====================================================
  {
    titre: "Le Squelette d'un Article",
    description: "Structure un article de blog en utilisant les balises sémantiques <header>, <article> et <footer>.",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 50,
    language: "HTML",
    initial_code: "<!-- Ton code ici -->\n",
    test_keywords: ["<header>", "<article>", "<footer>"]
  },
  {
    titre: "Formulaire de Contact",
    description: "Crée un formulaire de contact simple avec des champs pour le nom, l'email et un bouton d'envoi.",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 60,
    language: "HTML",
    initial_code: "<form>\n  <!-- Champs ici -->\n</form>",
    test_keywords: ['<input', 'type="text"', 'type="email"', "<button"]
  },
  {
    titre: "Liste de Navigation",
    description: "Utilise la balise <nav> et une liste non-ordonnée <ul> pour créer un menu de navigation.",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 40,
    language: "HTML",
    initial_code: "<nav>\n  <!-- Liste ici -->\n</nav>",
    test_keywords: ["<ul>", "<li>", "<a>"]
  },
  {
    titre: "Tableau de Prix",
    description: "Organise des tarifs dans un tableau HTML utilisant <table>, <tr> et <td>.",
    type: "algo",
    niveau: "Apprenti",
    xp_reward: 80,
    language: "HTML",
    initial_code: "<table>\n  <!-- Données ici -->\n</table>",
    test_keywords: ["<tr>", "<td>", "<th>"]
  },
  {
    titre: "Intégration Média",
    description: "Ajoute une image à ta page en n'oubliant pas l'attribut 'alt' pour l'accessibilité.",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 30,
    language: "HTML",
    initial_code: "<!-- Ajoute l'image ici -->\n",
    test_keywords: ["<img", "src=", "alt="]
  },
  {
    titre: "Barre de navigation accessible",
    description: "Crée une barre de navigation responsive avec un lien d'évitement ('skip to content') pour améliorer l'accessibilité. Ajoute les attributs ARIA nécessaires et assure-toi que le menu est utilisable au clavier.",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 100,
    language: "HTML",
    initial_code: '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <title>Nav accessible</title>\n</head>\n<body>\n  <main id="content">\n    <h1>Contenu principal</h1>\n  </main>\n</body>\n</html>',
    test_keywords: ["aria-label", "skip-link", "#content", "nav", "ul", "li"]
  },
  {
    titre: "Galerie d'images responsive avec figcaption",
    description: "Construis une galerie d'images qui s'affiche en grille (3 colonnes sur desktop, 1 sur mobile). Chaque image doit avoir une légende descriptive via <figcaption>.",
    type: "pixel_perfect",
    niveau: "Débutant",
    xp_reward: 110,
    language: "HTML",
    initial_code: '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <title>Galerie responsive</title>\n</head>\n<body>\n  <figure class="gallery">\n  </figure>\n</body>\n</html>',
    test_keywords: ["display: grid", "grid-template-columns", "<figcaption>", "<figure>", "max-width: 100%"]
  },
  {
    titre: "Article sémantique avec microdonnées",
    description: "Rédige un article de blog structuré avec <article>, <header>, <section>. Ajoute des microdonnées Schema.org (itemscope, itemtype) pour le titre, l'auteur et la date de publication.",
    type: "algo",
    niveau: "Apprenti",
    xp_reward: 150,
    language: "HTML",
    initial_code: '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <title>Article sémantique</title>\n</head>\n<body>\n</body>\n</html>',
    test_keywords: ["itemscope", "itemtype", 'itemprop="headline"', 'itemprop="author"', "datetime", "<article>"]
  },
  {
    titre: "Formulaire accessible avec champs groupés",
    description: "Crée un formulaire d'inscription avec groupement de champs (fieldset/legend), labels explicites, et attributs ARIA pour les messages d'erreur simulés.",
    type: "algo",
    niveau: "Apprenti",
    xp_reward: 180,
    language: "HTML",
    initial_code: '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <title>Formulaire accessible</title>\n</head>\n<body>\n  <form>\n  </form>\n</body>\n</html>',
    test_keywords: ["<fieldset>", "<legend>", "aria-required", "aria-invalid", "aria-live", "required"]
  },
  {
    titre: "Contrôles personnalisés pour lecteur vidéo",
    description: "Implémente un lecteur vidéo HTML5 avec contrôles personnalisés (play/pause, volume, progression) entièrement accessibles au clavier et avec attributs ARIA.",
    type: "algo",
    niveau: "Pilote",
    xp_reward: 250,
    language: "HTML",
    initial_code: '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <title>Lecteur vidéo</title>\n</head>\n<body>\n  <video id="video"></video>\n</body>\n</html>',
    test_keywords: ["video.play()", "video.pause()", "video.currentTime", "video.volume", 'role="toolbar"', "aria-label"]
  },
  {
    titre: "Tableau responsive avec en-tête fixe",
    description: "Crée un tableau de données large (au moins 6 colonnes) qui devient défilable horizontalement sur mobile. L'en-tête doit rester visible lors du défilement vertical (position: sticky).",
    type: "pixel_perfect",
    niveau: "Pilote",
    xp_reward: 220,
    language: "HTML",
    initial_code: '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <title>Tableau responsive</title>\n</head>\n<body>\n  <div class="table-wrapper">\n    <table></table>\n  </div>\n</body>\n</html>',
    test_keywords: ["overflow-x: auto", "position: sticky", "top: 0", "border-collapse", "min-width:"]
  },
  {
    titre: "Carte SVG interactive avec info-bulle",
    description: "Construis une carte SVG où chaque région affiche une infobulle personnalisée (tooltip) au survol et au focus, sans JavaScript (uniquement CSS et attributs title/aria-describedby).",
    type: "pixel_perfect",
    niveau: "Pilote",
    xp_reward: 280,
    language: "HTML",
    initial_code: '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <title>Carte interactive</title>\n</head>\n<body>\n  <svg viewBox="0 0 200 200" role="img" aria-label="Carte">\n  </svg>\n</body>\n</html>',
    test_keywords: ["<svg>", "<polygon>", 'tabindex="0"', "aria-describedby", 'role="tooltip"', ":hover", ":focus"]
  },

  // =====================================================
  // CSS Challenges
  // =====================================================
  {
    titre: "Le Panier Fantôme de Marcory",
    description: "Le bouton de paiement de la boutique 'Yassir-Style' est passé sous le footer sur mobile ! Rends-le visible en utilisant les propriétés de profondeur (z-index).",
    type: "bug_hunter",
    niveau: "Apprenti",
    xp_reward: 100,
    language: "CSS",
    initial_code: '<div style="position:relative;"><footer style="position:fixed; bottom:0; width:100%; height:60px; background:black; z-index:10;"></footer><button style="position:fixed; bottom:10px; background:orange; z-index:1;">VALIDER LA COMMANDE</button></div>',
    test_keywords: ["z-index: 11", "z-index: 20", "z-index: 100", "z-index:11", "z-index:20", "z-index:100"]
  },
  {
    titre: "La Carte VIP Assinie",
    description: "Intègre la carte de membre VIP du complexe hôtelier. Elle doit avoir un dégradé du bleu vers le vert et des bords très arrondis (24px).",
    type: "pixel_perfect",
    niveau: "Pilote",
    xp_reward: 250,
    language: "CSS",
    initial_code: '<div style="width:300px; height:180px; background:blue;">CARTE VIP</div>',
    test_keywords: ["border-radius: 24px", "linear-gradient", "border-radius:24px"]
  },
  {
    titre: "L'Alerte Mobile Money",
    description: "Urgent ! Sur l'interface de transfert de l'app 'Ivoire-Pay', le badge 'PROMO' chevauche le montant du solde. Utilise 'margin-top' ou 'position' pour le décaler.",
    type: "bug_hunter",
    niveau: "Apprenti",
    xp_reward: 120,
    language: "CSS",
    initial_code: '<div style="background:#eee; padding:20px;"><span style="background:red; color:white; padding:5px; position:absolute;">PROMO</span><h2 style="margin-top:0;">50.000 FCFA</h2></div>',
    test_keywords: ["margin-bottom: 20px", "top: -20px", "position: relative", "margin-top: -20px"]
  },
  {
    titre: "Le Header d'Assinie Beach",
    description: "Le client veut un header élégant pour son site de luxe. Applique un flou d'arrière-plan (backdrop-filter) et une bordure basse subtile pour un effet 'glassmorphism'.",
    type: "pixel_perfect",
    niveau: "Pilote",
    xp_reward: 200,
    language: "CSS",
    initial_code: '<nav style="height:60px; background: rgba(255,255,255,0.5);">Menu</nav>',
    test_keywords: ["backdrop-filter: blur", "border-bottom", "backdrop-filter:blur"]
  },
  {
    titre: "La Carte Gnonmi & Lait",
    description: "Design la carte produit ultime pour le nouveau resto tendance. Ajoute une ombre portée douce (box-shadow), une image arrondie et un bouton avec transition fluide.",
    type: "pixel_perfect",
    niveau: "Expert",
    xp_reward: 300,
    language: "CSS",
    initial_code: '<div style="width:200px; border:1px solid #ccc;">Gnonmi Deluxe</div>',
    test_keywords: ["box-shadow", "transition", "transform: scale", "transform:scale"]
  },
  {
    titre: "Le Bouton Fluo",
    description: "Donne un style néon à un bouton et change sa couleur au survol avec :hover.",
    type: "algo",
    niveau: "Apprenti",
    xp_reward: 70,
    language: "CSS",
    initial_code: "<style>\n  button {\n    /* Style ici */\n  }\n</style>\n<button>NÉON</button>",
    test_keywords: ["background", "box-shadow", ":hover"]
  },
  {
    titre: "Grille de Photos",
    description: "Crée une galerie d'images 3x3 en utilisant CSS Grid.",
    type: "algo",
    niveau: "Pilote",
    xp_reward: 120,
    language: "CSS",
    initial_code: "<style>\n  .gallery {\n    display: grid;\n  }\n</style>\n<div class='gallery'><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div></div>",
    test_keywords: ["grid-template-columns", "repeat(3", "gap"]
  },
  {
    titre: "Centrer un Div",
    description: "Le défi classique : centre parfaitement un carré au milieu de son conteneur avec Flexbox.",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 50,
    language: "CSS",
    initial_code: "<style>\n  .parent {\n    display: flex;\n    height: 200px;\n  }\n</style>\n<div class='parent'><div class='child'></div></div>",
    test_keywords: ["justify-content: center", "align-items: center"]
  },
  {
    titre: "Texte Arc-en-ciel",
    description: "Applique un dégradé linéaire sur le texte pour lui donner un effet coloré.",
    type: "algo",
    niveau: "Apprenti",
    xp_reward: 90,
    language: "CSS",
    initial_code: "<style>\n  h1 {\n    /* Dégradé ici */\n  }\n</style>\n<h1>MAGIC</h1>",
    test_keywords: ["linear-gradient", "background-clip: text", "transparent"]
  },
  {
    titre: "Carte Profil",
    description: "Design une carte avec des bords arrondis (border-radius) et une ombre douce (box-shadow).",
    type: "algo",
    niveau: "Apprenti",
    xp_reward: 60,
    language: "CSS",
    initial_code: "<style>\n  .card {\n    /* Design ici */\n  }\n</style>\n<div class='card'>Profil</div>",
    test_keywords: ["border-radius", "box-shadow", "padding"]
  },

  // =====================================================
  // JavaScript Challenges
  // =====================================================
  {
    titre: "Le Formateur de Prix FCFA",
    description: "Corrige l'affichage du prix. Le montant 2500.899999 doit devenir '2 501 FCFA'. Utilise les arrondis.",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 150,
    language: "JavaScript",
    initial_code: "<span>2500.899999</span>",
    test_keywords: ["2 501 FCFA", "Math.round", "fixed"]
  },
  {
    titre: "Le Convertisseur d'Hectares",
    description: "Une coopérative agricole à Yamoussoukro a besoin d'afficher ses surfaces. Convertis 15500 m² en hectares (1 ha = 10 000 m²) et affiche le résultat avec 2 décimales suivi de 'ha'.",
    type: "algo",
    niveau: "Apprenti",
    xp_reward: 150,
    language: "JavaScript",
    initial_code: "<div>15500</div>",
    test_keywords: ["1.55 ha", "Math.round", "toFixed"]
  },
  {
    titre: "Compteur de Clics",
    description: "Incrémente la valeur affichée dans un <span> à chaque clic sur le bouton.",
    type: "algo",
    niveau: "Apprenti",
    xp_reward: 80,
    language: "JavaScript",
    initial_code: "<span id='count'>0</span>\n<button id='btn'>+1</button>\n<script>\n  // Ton code JS ici\n</script>",
    test_keywords: ["addEventListener", "innerText", "++"]
  },
  {
    titre: "Mode Sombre",
    description: "Bascule la classe 'dark' sur le document.body lors du clic sur un bouton.",
    type: "algo",
    niveau: "Apprenti",
    xp_reward: 100,
    language: "JavaScript",
    initial_code: "<button id='toggle'>Switch</button>\n<script>\n  // Toggle dark mode\n</script>",
    test_keywords: ["classList.toggle", "dark", "body"]
  },
  {
    titre: "Calculateur de Pourboire",
    description: "Écris une fonction qui prend un montant et retourne 15% de pourboire.",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 60,
    language: "JavaScript",
    initial_code: "function calculateTip(amount) {\n  // Code\n}",
    test_keywords: ["return", "* 0.15", "amount"]
  },
  {
    titre: "Générateur de Citations",
    description: "Affiche une citation aléatoire tirée d'un tableau de chaînes de caractères.",
    type: "algo",
    niveau: "Apprenti",
    xp_reward: 110,
    language: "JavaScript",
    initial_code: "const quotes = ['Veni', 'Vidi', 'Vici'];\n// Affiche une citation au hasard",
    test_keywords: ["Math.random", "Math.floor", "quotes["]
  },
  {
    titre: "Vérification d'Âge",
    description: "Affiche 'Majeur' si l'âge est >= 18, sinon 'Mineur'.",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 40,
    language: "JavaScript",
    initial_code: "let age = 20;\n// Ton test ici",
    test_keywords: ["if", "else", "18"]
  },

  // =====================================================
  // Python Challenges
  // =====================================================
  {
    titre: "Le Cri du Serpent",
    description: "Apprends à faire parler ton code ! Affiche le message \"Je suis un développeur Python\" dans la console.",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 40,
    language: "Python",
    initial_code: "# Ton code ici\n",
    test_keywords: ["print", '"Je suis un développeur Python"']
  },
  {
    titre: "Calculateur d'Âge",
    description: "Crée une variable \"annee_naissance\" et \"annee_actuelle\". Calcule et affiche l'âge.",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 60,
    language: "Python",
    initial_code: "annee_actuelle = 2026\n",
    test_keywords: ["annee_naissance =", "print", "-"]
  },
  {
    titre: "Pair ou Impair",
    description: "Utilise un bloc if/else pour vérifier si la variable \"nombre\" est paire ou impaire.",
    type: "algo",
    niveau: "Apprenti",
    xp_reward: 80,
    language: "Python",
    initial_code: "nombre = 7\n",
    test_keywords: ["if", "else", "% 2 == 0", "print"]
  },
  {
    titre: "Inverser une Chaîne",
    description: "Inverse l'ordre des caractères d'une chaîne de texte (ex: 'Python' -> 'nohtyP').",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 50,
    language: "Python",
    initial_code: "texte = 'Python'\n# Inverse ici\n",
    test_keywords: ["[::-1]", "print"]
  },
  {
    titre: "Moyenne de Notes",
    description: "Calcule la moyenne d'une liste de nombres : [12, 15, 18, 10].",
    type: "algo",
    niveau: "Apprenti",
    xp_reward: 70,
    language: "Python",
    initial_code: "notes = [12, 15, 18, 10]\n# Calcul\n",
    test_keywords: ["sum(notes)", "len(notes)", "/"]
  },
  {
    titre: "Le Devin",
    description: "Génère un nombre aléatoire entre 1 et 10 et compare-le à une variable 'choix'.",
    type: "algo",
    niveau: "Apprenti",
    xp_reward: 90,
    language: "Python",
    initial_code: "import random\nchoix = 7\n# Code du devin\n",
    test_keywords: ["random.randint", "if", "=="]
  },

  // =====================================================
  // PHP Challenges
  // =====================================================
  {
    titre: "L'Écho du Serveur",
    description: "Fais résonner ton serveur ! Affiche \"PHP est prêt\" en utilisant la commande echo.",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 40,
    language: "PHP",
    initial_code: "<?php\n// Ton code ici\n",
    test_keywords: ["<?php", "echo", '"PHP est prêt"']
  },
  {
    titre: "Dynamic Date",
    description: "Affiche l'année actuelle dynamiquement en utilisant la fonction date().",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 50,
    language: "PHP",
    initial_code: "<?php\n",
    test_keywords: ["<?php", "echo date(", '"Y"']
  },
  {
    titre: "Message de Bienvenue",
    description: "Affiche 'Bonjour' suivi de l'heure actuelle (format H:i).",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 40,
    language: "PHP",
    initial_code: "<?php\n// Ton code ici\n",
    test_keywords: ["echo", "date(", "'H:i'"]
  },
  {
    titre: "Générateur de Table de Multi",
    description: "Utilise une boucle 'for' pour afficher la table de multiplication de 7.",
    type: "algo",
    niveau: "Apprenti",
    xp_reward: 90,
    language: "PHP",
    initial_code: "<?php\n// Table de 7\n",
    test_keywords: ["for", "7 *", "echo"]
  },
  {
    titre: "Vérification de Login",
    description: "Vérifie si $user est 'admin' ET $pass est '1234'.",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 50,
    language: "PHP",
    initial_code: "<?php\n$user = 'admin';\n$pass = '1234';\n// Test",
    test_keywords: ["if", "&&", "=="]
  },
  {
    titre: "Calculateur de TVA",
    description: "Calcule le prix TTC d'un article à partir de son prix HT ($ht = 100) avec une TVA de 20%.",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 60,
    language: "PHP",
    initial_code: "<?php\n$ht = 100;\n// Calcul TTC",
    test_keywords: ["* 1.2", "echo"]
  }
];

async function seedAll() {
  console.log('🚀 Début du seed complet des défis...\n');

  // 1. Récupérer les titres existants pour éviter les doublons
  const { data: existing, error: fetchError } = await supabase
    .from('challenges')
    .select('titre');

  if (fetchError) {
    console.error('❌ Erreur lecture DB:', fetchError.message);
    process.exit(1);
  }

  const existingTitles = new Set(existing?.map(c => c.titre) || []);
  console.log(`📋 ${existingTitles.size} défis existants détectés\n`);

  // 2. Filtrer les nouveaux défis
  const toInsert = allChallenges.filter(c => !existingTitles.has(c.titre));

  if (toInsert.length === 0) {
    console.log('✅ Tous les défis existent déjà dans la base !');
    return;
  }

  console.log(`📥 ${toInsert.length} nouveaux défis à insérer :\n`);

  // 3. Insertion par batches de 5
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < toInsert.length; i += 5) {
    const batch = toInsert.slice(i, i + 5);
    const { error } = await supabase.from('challenges').insert(batch);

    if (error) {
      console.error(`❌ Erreur batch ${i / 5 + 1}:`, error.message);
      errorCount += batch.length;
    } else {
      for (const c of batch) {
        const lang = (c.language || '').padEnd(10);
        console.log(`   ✅ [${lang}] ${c.titre} (${c.xp_reward} XP)`);
        successCount++;
      }
    }
  }

  console.log(`\n🏁 Terminé ! ${successCount} insérés, ${errorCount} erreurs.`);
}

seedAll();
