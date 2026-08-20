import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  // L'auth custom utilise maintenant ses propres pages
  // Rediriger vers l'accueil
  return NextResponse.redirect(`${origin}/`)
}
