const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.error('Erreur: Variables d\'environnement manquantes dans .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabasePublishableKey);

const challenges = [
  {
    titre: "Le Panier Fantôme de Marcory",
    description: "Le bouton de paiement de la boutique 'Yassir-Style' est passé sous le footer sur mobile ! Rends-le visible en utilisant les propriétés de profondeur (z-index).",
    type: "bug_hunter",
    niveau: "Apprenti",
    xp_reward: 100,
    initial_code: `<div style="position:relative;"><footer style="position:fixed; bottom:0; width:100%; height:60px; background:black; z-index:10;"></footer><button style="position:fixed; bottom:10px; background:orange; z-index:1;">VALIDER LA COMMANDE</button></div>`,
    test_keywords: ["z-index: 11", "z-index: 20", "z-index: 100", "z-index:11", "z-index:20", "z-index:100"]
  },
  {
    titre: "La Carte VIP Assinie",
    description: "Intègre la carte de membre VIP du complexe hôtelier. Elle doit avoir un dégradé du bleu vers le vert et des bords très arrondis (24px).",
    type: "pixel_perfect",
    niveau: "Pilote",
    xp_reward: 250,
    initial_code: `<div style="width:300px; height:180px; background:blue;">CARTE VIP</div>`,
    test_keywords: ["border-radius: 24px", "linear-gradient", "border-radius:24px"]
  },
  {
    titre: "Le Formateur de Prix FCFA",
    description: "Corrige l'affichage du prix. Le montant 2500.899999 doit devenir '2 501 FCFA'. Utilise les arrondis.",
    type: "algo",
    niveau: "Débutant",
    xp_reward: 150,
    initial_code: `<span>2500.899999</span>`,
    test_keywords: ["2 501 FCFA", "Math.round", "fixed"]
  }
];

async function seed() {
  console.log('Début de l\'injection des défis...');
  
  for (const challenge of challenges) {
    const { data, error } = await supabase
      .from('challenges')
      .insert([challenge])
      .select();
    
    if (error) {
      console.error(`Erreur pour "${challenge.titre}":`, error.message);
    } else {
      console.log(`Défis "${challenge.titre}" injecté avec succès !`);
    }
  }
  
  console.log('Injection terminée.');
}

seed();
