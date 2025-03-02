import { createClient } from '@supabase/supabase-js'

// Récupérer les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Vérifier que les variables d'environnement sont définies
if (!supabaseUrl || !supabaseKey) {
  console.error('Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies')
}

// Créer une instance du client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey) 