import ConversationContactDetail from './conversation-contact-detail';
import ConversationDetails from './active-conversation';
import { createClient } from '@/utils/supabase/server';

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const supabase = await createClient();
	const companyId = searchParams.companyId ? parseInt(searchParams.companyId as string) : undefined;
	const contactId = searchParams.contactId ? parseInt(searchParams.contactId as string) : undefined;
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<main className='grid grid-cols-[1fr_3fr] w-full gap-3'>
			<ConversationContactDetail contactId={contactId ?? user?.user_metadata?.contactId} />

			<ConversationDetails
				contactId={contactId}
				companyId={companyId}
				className='p-6'
			/>
		</main>
	);
}
