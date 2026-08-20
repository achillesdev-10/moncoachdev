-- ============================================================
-- SYSTÈME D'AUTHENTIFICATION PERSONNALISÉ (sans dépendance externe)
-- ============================================================

-- Table des utilisateurs (remplace profiles pour l'auth)
CREATE TABLE IF NOT EXISTS app_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  username TEXT,
  xp INTEGER DEFAULT 0,
  rank TEXT DEFAULT 'Apprenti',
  security_question TEXT NOT NULL,
  security_answer_hash TEXT NOT NULL,
  reset_token TEXT,
  reset_token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des sessions de connexion
CREATE TABLE IF NOT EXISTS login_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES app_users(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_sessions_token ON login_sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON login_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON app_users(email);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON app_users(reset_token);

-- RLS : désactivé pour auth custom (gestion côté app)
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_sessions ENABLE ROW LEVEL SECURITY;

-- Politiques permissives pour l'auth custom
CREATE POLICY "allow_all_app_users" ON app_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_sessions" ON login_sessions FOR ALL USING (true) WITH CHECK (true);

-- Table des défis (si elle n'existe pas déjà)
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT CHECK (type IN ('bug_hunter', 'pixel_perfect', 'algo')) NOT NULL,
  niveau TEXT CHECK (niveau IN ('Débutant', 'Apprenti', 'Pilote', 'Expert', 'Hacker', 'Intermédiaire', 'Avancé')) NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  initial_code TEXT,
  test_keywords TEXT[],
  language TEXT NOT NULL DEFAULT 'HTML',
  categorie TEXT
);

-- Table des complétions de défis
CREATE TABLE IF NOT EXISTS user_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES app_users(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

ALTER TABLE user_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_completions" ON user_completions FOR ALL USING (true) WITH CHECK (true);

-- Table des projets playground
CREATE TABLE IF NOT EXISTS user_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES app_users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  html_code TEXT,
  css_code TEXT,
  js_code TEXT,
  python_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_projects" ON user_projects FOR ALL USING (true) WITH CHECK (true);
