import { supabase } from './supabase';

// ============================================================
// HASHAGE DES MOTS DE PASSE (SHA-256 via Web Crypto API)
// ============================================================

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'MonCoachDev_Salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// ============================================================
// GESTION DES SESSIONS
// ============================================================

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function createSession(userId: string): Promise<string> {
  // Supprimer les anciennes sessions de cet utilisateur
  await supabase.from('login_sessions').delete().eq('user_id', userId);

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

  await supabase.from('login_sessions').insert({
    user_id: userId,
    token,
    expires_at: expiresAt.toISOString(),
  });

  // Stocker dans localStorage + cookie (pour le middleware)
  if (typeof window !== 'undefined') {
    localStorage.setItem('session_token', token);
    // Cookie httpOnly-like via document.cookie (accessible côté serveur par le middleware)
    document.cookie = `session_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  }

  return token;
}

export async function getCurrentUser() {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('session_token');
  if (!token) return null;

  const { data: session } = await supabase
    .from('login_sessions')
    .select('*, app_user:app_users(*)')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (!session) {
    localStorage.removeItem('session_token');
    return null;
  }

  return session.app_user;
}

export async function logout() {
  if (typeof window === 'undefined') return;

  const token = localStorage.getItem('session_token');
  if (token) {
    await supabase.from('login_sessions').delete().eq('token', token);
    localStorage.removeItem('session_token');
    // Supprimer le cookie
    document.cookie = 'session_token=; path=/; max-age=0';
  }
}

// ============================================================
// INSCRIPTION
// ============================================================

export async function signUp(
  email: string,
  password: string,
  username: string,
  securityQuestion: string,
  securityAnswer: string
): Promise<{ error?: string }> {
  // Vérifier si l'email existe déjà
  const { data: existing } = await supabase
    .from('app_users')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (existing) {
    return { error: 'Un compte avec cet email existe déjà.' };
  }

  const passwordHash = await hashPassword(password);
  const answerHash = await hashPassword(securityAnswer.toLowerCase().trim());

  const { data: user, error } = await supabase
    .from('app_users')
    .insert({
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      username: username || email.split('@')[0],
      security_question: securityQuestion,
      security_answer_hash: answerHash,
    })
    .select()
    .single();

  if (error) {
    return { error: 'Erreur lors de la création du compte.' };
  }

  // Créer une session automatiquement
  await createSession(user.id);

  return {};
}

// ============================================================
// CONNEXION
// ============================================================

export async function signIn(
  email: string,
  password: string
): Promise<{ error?: string; user?: any }> {
  const { data: user } = await supabase
    .from('app_users')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (!user) {
    return { error: 'Aucun compte trouvé avec cet email.' };
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return { error: 'Mot de passe incorrect.' };
  }

  await createSession(user.id);

  return { user };
}

// ============================================================
// RÉCUPÉRATION DE MOT DE PASSE (via question de sécurité)
// ============================================================

export async function getSecurityQuestion(
  email: string
): Promise<{ question?: string; error?: string }> {
  const { data: user } = await supabase
    .from('app_users')
    .select('security_question')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (!user) {
    return { error: 'Aucun compte trouvé avec cet email.' };
  }

  return { question: user.security_question };
}

export async function verifySecurityAnswer(
  email: string,
  answer: string
): Promise<{ token?: string; error?: string }> {
  const { data: user } = await supabase
    .from('app_users')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (!user) {
    return { error: 'Aucun compte trouvé.' };
  }

  const valid = await verifyPassword(answer.toLowerCase().trim(), user.security_answer_hash);
  if (!valid) {
    return { error: 'Réponse incorrecte. Essaie encore.' };
  }

  // Générer un token de réinitialisation
  const resetToken = generateToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await supabase
    .from('app_users')
    .update({
      reset_token: resetToken,
      reset_token_expires_at: expiresAt.toISOString(),
    })
    .eq('id', user.id);

  return { token: resetToken };
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ error?: string }> {
  const { data: user } = await supabase
    .from('app_users')
    .select('id')
    .eq('reset_token', token)
    .gt('reset_token_expires_at', new Date().toISOString())
    .single();

  if (!user) {
    return { error: 'Token invalide ou expiré. Recommence la procédure.' };
  }

  const passwordHash = await hashPassword(newPassword);

  await supabase
    .from('app_users')
    .update({
      password_hash: passwordHash,
      reset_token: null,
      reset_token_expires_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  return {};
}
