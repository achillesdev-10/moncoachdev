const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.error('Erreur: Variables d\'environnement manquantes dans .env.local (URL ou PUBLISHABLE_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabasePublishableKey);

const expansionChallenges = [
  {
    titre: "L'Alerte Mobile Money",
    description: "Urgent ! Sur l'interface de transfert de l'app 'Ivoire-Pay', le badge 'PROMO' chevauche le montant du solde. Utilise 'margin-top' ou 'position' pour le décaler de 20px vers le haut et libérer la vue.",
    type: "bug_hunter",
    niveau: "Apprenti",
    xp_reward: 120,
    initial_code: `<div style="background:#eee; padding:20px;"><span style="background:red; color:white; padding:5px; position:absolute;">PROMO</span><h2 style="margin-top:0;">50.000 FCFA</h2></div>`,
    test_keywords: ["margin-bottom: 20px", "top: -20px", "position: relative", "margin-top: -20px"]
  },
  {
    titre: "Le Header d'Assinie Beach",
    description: "Le client veut un header élégant pour son site de luxe. Applique un flou d'arrière-plan (backdrop-filter) et une bordure basse subtile de 1px blanche semi-transparente pour un effet 'glassmorphism'.",
    type: "pixel_perfect",
    niveau: "Pilote",
    xp_reward: 200,
    initial_code: `<nav style="height:60px; background: rgba(255,255,255,0.5);">Menu</nav>`,
    test_keywords: ["backdrop-filter: blur", "border-bottom", "backdrop-filter:blur"]
  },
  {
    titre: "Le Convertisseur d'Hectares",
    description: "Une coopérative agricole à Yamoussoukro a besoin d'afficher ses surfaces. Convertis 15500 m² en hectares (1 ha = 10 000 m²) et affiche le résultat avec 2 décimales suivi de 'ha'.",
    type: "algo",
    niveau: "Apprenti",
    xp_reward: 150,
    initial_code: `<div>15500</div>`,
    test_keywords: ["1.55 ha", "Math.round", "toFixed"]
  },
  {
    titre: "La Carte Gnonmi & Lait",
    description: "Design la carte produit ultime pour le nouveau resto tendance. Ajoute une ombre portée douce (box-shadow), une image arrondie et un bouton 'Commander' qui change de taille au survol (scale) avec une transition fluide.",
    type: "pixel_perfect",
    niveau: "Expert",
    xp_reward: 300,
    initial_code: `<div style="width:200px; border:1px solid #ccc;">Gnonmi Deluxe</div>`,
    test_keywords: ["box-shadow", "transition", "transform: scale", "transform:scale"]
  }
];

async function seedExpansion() {
  console.log('Début de l\'expansion du catalogue "Côte d\'Ivoire Tech"...');
  
  for (const challenge of expansionChallenges) {
    // Vérifier si le défi existe déjà pour éviter les doublons lors du test
    const { data: existing } = await supabase
      .from('challenges')
      .select('id')
      .eq('titre', challenge.titre)
      .single();

    if (existing) {
      console.log(`Le défi "${challenge.titre}" existe déjà, mise à jour...`);
      const { error } = await supabase
        .from('challenges')
        .update(challenge)
        .eq('id', existing.id);
      if (error) console.error(`Erreur lors de la mise à jour de "${challenge.titre}":`, error.message);
      else console.log(`Défis "${challenge.titre}" mis à jour avec succès !`);
    } else {
      const { error } = await supabase
        .from('challenges')
        .insert([challenge]);
      if (error) console.error(`Erreur lors de l'insertion de "${challenge.titre}":`, error.message);
      else console.log(`Défis "${challenge.titre}" injecté avec succès !`);
    }
  }
  
  console.log('Expansion terminée avec succès.');
}

seedExpansion();
