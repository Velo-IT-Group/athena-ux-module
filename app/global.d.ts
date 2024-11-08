import type { Database as DB } from '@/types/supabase';

declare global {
	type Database = DB;

	type Conversation = Database['reporting']['Tables']['conversations']['Row'];
	type Profile = Database['public']['Tables']['profiles']['Row'];
	type ProfileKey = Database['public']['Tables']['profile_keys']['Row'];
}
