import type { Database as DB, Tables } from '@/types/supabase';
import { Tables } from '@/types/supabase';

declare global {
	type Database = DB;

	type Conversation = Tables<'conversations'>;
}
