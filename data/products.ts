export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  thumbnail: string;
  chariowLink: string;
  badge?: 'Nouveau' | 'Best-Seller' | 'Promotion';
  benefits: string[];
  category: 'Frontend' | 'Backend' | 'IA' | 'Soft Skills';
}

export const products: Product[] = [
  {
    id: 'master-nextjs-supabase',
    title: 'Masterclass Next.js 15 & Supabase',
    description: 'Apprenez à bâtir des SaaS modernes et scalables de A à Z avec les dernières technologies.',
    price: 45000,
    currency: 'FCFA',
    thumbnail: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?q=80&w=800&auto=format&fit=crop',
    chariowLink: 'https://chariow.com/pay/master-nextjs', // Lien à remplacer par le vrai
    badge: 'Best-Seller',
    category: 'Frontend',
    benefits: ['Accès à vie', 'Projet concret (SaaS)', 'Support Discord', 'Mises à jour incluses']
  },
  {
    id: 'python-ia-automation',
    title: 'Python, IA & Automatisation',
    description: 'Dominez Python et intégrez l\'IA (OpenAI, LangChain) dans vos workflows quotidiens.',
    price: 35000,
    currency: 'FCFA',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop',
    chariowLink: 'https://chariow.com/pay/python-ia', // Lien à remplacer par le vrai
    badge: 'Nouveau',
    category: 'IA',
    benefits: ['Scripts d\'automatisation', 'Intégration API OpenAI', 'Data Science bases', 'Certificat de fin']
  },
  {
    id: 'backend-php-expert',
    title: 'Architecture Backend PHP Moderne',
    description: 'Allez au-delà du code spaghetti. Maîtrisez les Design Patterns et le Clean Code en PHP.',
    price: 25000,
    currency: 'FCFA',
    thumbnail: 'https://images.unsplash.com/photo-1599507593499-a3f7f7d9a2cc?q=80&w=800&auto=format&fit=crop',
    chariowLink: 'https://chariow.com/pay/php-expert', // Lien à remplacer par le vrai
    category: 'Backend',
    benefits: ['POO Avancée', 'Sécurité Backend', 'Optimisation SQL', 'Architecture Hexagonale']
  },
  {
    id: 'freelance-developer-guide',
    title: 'Le Guide du Développeur Freelance',
    description: 'Comment trouver vos premiers clients, fixer vos tarifs et gérer vos projets comme un pro.',
    price: 15000,
    currency: 'FCFA',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
    chariowLink: 'https://chariow.com/pay/freelance-guide', // Lien à remplacer par le vrai
    badge: 'Promotion',
    category: 'Soft Skills',
    benefits: ['Modèles de devis/factures', 'Techniques de prospection', 'Gestion du temps', 'Mindset Entrepreneur']
  }
];
