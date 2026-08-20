-- Création de la table challenges
CREATE TABLE challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT CHECK (type IN ('bug_hunter', 'pixel_perfect', 'algo')) NOT NULL,
  niveau TEXT CHECK (niveau IN ('Débutant', 'Apprenti', 'Pilote', 'Expert', 'Hacker')) NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  initial_code TEXT,
  test_keywords TEXT[],
  language TEXT NOT NULL DEFAULT 'HTML',
  categorie TEXT
);

-- Activation de Row Level Security (RLS)
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Politique de lecture pour tous les utilisateurs (connectés ou non)
CREATE POLICY "Les défis sont consultables par tous" 
ON challenges FOR SELECT 
USING (true);

-- Politique d'insertion/modification réservée aux administrateurs (exemple simple)
-- Note: Dans une vraie app, on vérifierait le rôle de l'utilisateur
CREATE POLICY "Seuls les admins peuvent modifier les défis" 
ON challenges FOR ALL 
USING (auth.role() = 'service_role');

-- Table des profils utilisateurs pour gérer l'XP
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  xp INTEGER DEFAULT 0,
  rank TEXT DEFAULT 'Apprenti',
  is_admin BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activation RLS pour les profils
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique de lecture : tout le monde peut voir les profils
CREATE POLICY "Les profils sont publics" 
ON profiles FOR SELECT 
USING (true);

-- Politique de mise à jour : l'utilisateur ne peut modifier que son propre profil
CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Fonction et Trigger pour créer un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Table pour le suivi des visites du site
CREATE TABLE site_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- RLS pour site_visits
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

-- Politique d'insertion pour tous (anonyme ou connecté)
CREATE POLICY "Tout le monde peut enregistrer une visite"
ON site_visits FOR INSERT
WITH CHECK (true);

-- Politique de lecture réservée aux admins
CREATE POLICY "Seuls les admins peuvent voir les visites"
ON site_visits FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

-- Table des réussites de défis
CREATE TABLE user_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- RLS pour user_completions
ALTER TABLE user_completions ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres réussites
CREATE POLICY "Les utilisateurs voient leurs réussites"
ON user_completions FOR SELECT
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent insérer leurs réussites
CREATE POLICY "Les utilisateurs insèrent leurs réussites"
ON user_completions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Nouveaux défis Backend (Python & PHP) - Expansion 15 Défis
INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language)
VALUES 
-- PYTHON
('Le Cri du Serpent', 'Apprends à faire parler ton code ! Affiche le message "Je suis un développeur Python" dans la console.', 'Débutant', 40, 'algo', '# Ton code ici\n', ARRAY['print', '"Je suis un développeur Python"'], 'Python'),
('Calculateur d''Âge', 'Crée une variable "annee_naissance" et une variable "annee_actuelle". Calcule et affiche l''âge.', 'Débutant', 60, 'algo', 'annee_actuelle = 2026\n', ARRAY['annee_naissance =', 'print', '-'], 'Python'),
('Pair ou Impair', 'Utilise un bloc if/else pour vérifier si la variable "nombre" est paire ou impaire.', 'Apprenti', 80, 'algo', 'nombre = 7\n', ARRAY['if', 'else', '% 2 == 0', 'print'], 'Python'),
('La Liste de Courses', 'Parcours une liste nommée "courses" et affiche chaque élément précédé de "Acheter : ".', 'Apprenti', 100, 'algo', 'courses = ["Pain", "Lait", "Café"]\n', ARRAY['for', 'in courses', 'print', '"Acheter : "'], 'Python'),
('Le Juste Prix', 'Utilise une boucle while pour afficher les nombres de 1 à 10 (le prix monte !).', 'Apprenti', 120, 'algo', 'prix = 1\n', ARRAY['while', 'prix <= 10', 'print', 'prix += 1'], 'Python'),
('Formateur de Nom', 'Utilise une méthode de chaîne pour mettre le nom "moncoachdev" en majuscules.', 'Apprenti', 70, 'algo', 'nom = "moncoachdev"\n', ARRAY['nom.upper()', 'print'], 'Python'),
('Table de Multiplication', 'Affiche la table de 5 (de 1 à 10) en utilisant une boucle.', 'Pilote', 150, 'algo', '# Affiche la table de 5\n', ARRAY['for', 'range(1, 11)', '5 *', 'print'], 'Python'),

-- PHP
('L''Écho du Serveur', 'Fais résonner ton serveur ! Affiche "PHP est prêt" en utilisant la commande echo.', 'Débutant', 40, 'algo', '<?php\n// Ton code ici\n', ARRAY['<?php', 'echo', '"PHP est prêt"'], 'PHP'),
('Dynamic Date', 'Affiche l''année actuelle dynamiquement en utilisant la fonction date().', 'Débutant', 50, 'algo', '<?php\n', ARRAY['<?php', 'echo date(', '"Y"'], 'PHP'),
('Concaténation', 'Réunis deux variables $prenom et $nom pour afficher le nom complet avec un espace.', 'Apprenti', 60, 'algo', '<?php\n$prenom = "Abidjan";\n$nom = "Tech";\n', ARRAY['$prenom .', '" "', '. $nom'], 'PHP'),
('Le Distributeur', 'Utilise un switch pour afficher "Café", "Thé" ou "Eau" selon la valeur de $choix.', 'Apprenti', 90, 'algo', '<?php\n$choix = "Café";\n', ARRAY['switch', 'case', 'break', 'echo'], 'PHP'),
('Tableau de Scores', 'Crée un tableau $scores avec 3 nombres et affiche la somme totale.', 'Apprenti', 110, 'algo', '<?php\n', ARRAY['$scores = [', 'array_sum(', 'echo'], 'PHP'),
('Filtrage d''Email', 'Vérifie si la variable $email contient un "@" en utilisant str_contains().', 'Pilote', 130, 'algo', '<?php\n$email = "test@dev.com";\n', ARRAY['str_contains(', '$email', '"@"'], 'PHP'),
('Compteur de Mots', 'Compte le nombre de mots dans la phrase "Le code est une aventure" avec str_word_count().', 'Apprenti', 80, 'algo', '<?php\n$phrase = "Le code est une aventure";\n', ARRAY['str_word_count(', '$phrase', 'echo'], 'PHP');

-- 4. Défis Prioritaires Python/PHP
INSERT INTO challenges (titre, description, niveau, xp_reward, type, initial_code, test_keywords, language, categorie)
VALUES 
('Le Cri du Serpent (V2)', 'Fais tes premiers pas en Python ! Affiche un message dans la console.', 'Débutant', 10, 'algo', '# Écris ton code ici\n', ARRAY['print'], 'Python', 'Basique'),
('Calculateur d''Âge (V2)', 'Apprends à manipuler les variables en Python.', 'Débutant', 20, 'algo', 'annee_naissance = 2000\n', ARRAY['annee_actuelle =', 'print'], 'Python', 'Variables'),
('L''Écho du Serveur (V2)', 'Découvre la base de PHP avec la commande echo.', 'Débutant', 10, 'algo', '<?php\n', ARRAY['<?php', 'echo'], 'PHP', 'Basique'),
('Tableau de Scores (V2)', 'Apprends à manipuler les tableaux en PHP.', 'Apprenti', 40, 'algo', '<?php\n$scores = [10, 20, 30];\n', ARRAY['array_sum', 'echo'], 'PHP', 'Arrays'),
('Pair ou Impair (V2)', 'Utilise la logique conditionnelle en Python.', 'Apprenti', 30, 'algo', 'nombre = 10\n', ARRAY['if', 'else', '% 2 == 0'], 'Python', 'Logique');
