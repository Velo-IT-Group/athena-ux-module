import ConversationContactDetail from './conversation-contact-detail';
import ConversationDetails from './active-conversation';
import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/navbar';

export default async function Page(props: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const searchParams = await props.searchParams;
	const supabase = await createClient();
	const companyId = searchParams.companyId
		? parseInt(searchParams.companyId as string)
		: undefined;
	const contactId = searchParams.contactId
		? parseInt(searchParams.contactId as string)
		: undefined;
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<>
			<Navbar />

			<main className="grid grid-cols-[1fr_3fr] w-full gap-3">
				<ConversationContactDetail
					contactId={contactId ?? user?.user_metadata?.contactId}
				/>

				<ConversationDetails
					contactId={contactId}
					companyId={companyId ?? 250}
					className="p-6"
				/>
			</main>
		</>
	);
}
