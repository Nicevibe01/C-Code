
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wwscqxsjtnwlkagwqbvv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Ac8TxMn-Es40Sl_U2IOUbg_qpTKnPcF'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)