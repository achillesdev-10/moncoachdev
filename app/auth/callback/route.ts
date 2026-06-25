import { createServerClient, type CookieOptions } from '@supabase/ssr' 
 import { cookies } from 'next/headers' 
 import { NextResponse } from 'next/server' 
 
 export async function GET(request: Request) { 
   const { searchParams, origin } = new URL(request.url) 
   const code = searchParams.get('code') 
   const next = searchParams.get('next') ?? '/' 
 
   if (code) { 
     // CORRECTION : ajout de await pour Next.js 16+ 
     const cookieStore = await cookies() 
     
     const supabase = createServerClient( 
       process.env.NEXT_PUBLIC_SUPABASE_URL!, 
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
       { 
         cookies: { 
           get(name: string) { 
             return cookieStore.get(name)?.value 
           }, 
           set(name: string, value: string, options: CookieOptions) { 
             console.log(`Setting cookie: ${name}`)
             cookieStore.set({ name, value, ...options }) 
           }, 
           remove(name: string, options: CookieOptions) { 
             console.log(`Removing cookie: ${name}`)
             cookieStore.set({ name, value: '', ...options }) 
           }, 
         }, 
       } 
     ) 
     
     const { data, error } = await supabase.auth.exchangeCodeForSession(code) 
     
     if (error) {
       console.error('Exchange error:', error.message)
       return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
     }

     // MISSION FINALE : Synchronisation Auth -> Profiles
     const { data: { user } } = await supabase.auth.getUser();
     
     if (user) {
       // Vérifier si le profil existe déjà
       const { data: profile, error: profileError } = await supabase
         .from('profiles')
         .select('id')
         .eq('id', user.id)
         .single();

       if (profileError && profileError.code === 'PGRST116') {
         // Profil inexistant, on le crée
         console.log('Creating profile for user:', user.email);
         const { error: insertError } = await supabase
           .from('profiles')
           .insert([
             {
               id: user.id,
               username: user.user_metadata?.full_name || user.email,
               xp: 0,
               rank: 'Apprenti'
             }
           ]);

         if (insertError) {
           console.error('Error creating profile:', insertError.message);
           // On ne bloque pas la redirection même si la création du profil échoue
         }
       }
     }

     console.log('Auth success, user:', data.user?.email)
     return NextResponse.redirect(`${origin}${next}`) 
   } 
 
   return NextResponse.redirect(`${origin}/login?error=auth-code-error`) 
 }