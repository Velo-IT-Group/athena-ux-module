import ConversationContactDetail from './conversation-contact-detail';
import ConversationDetails from './active-conversation';
import { getTask } from '@/lib/twilio/taskrouter/helpers';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { getContactCommunications } from '@/lib/manage/read';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { Conditions } from '@/utils/manage/params';
import { ServiceTicket } from '@/types/manage';

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	// const ticketFilterCookieKey = 'filter-dashboard-tickets';
	// const ticketFilterCookie = cookies().get(ticketFilterCookieKey);
	// const ticketFilter = (ticketFilterCookie ? JSON.parse(ticketFilterCookie.value) : {}) as Conditions<ServiceTicket>;
	const companyId = searchParams.companyId ? parseInt(searchParams.companyId as string) : undefined;
	const contactId = searchParams.contactId ? parseInt(searchParams.contactId as string) : undefined;
	const contactCommunications = await getContactCommunications(contactId ?? user?.user_metadata?.contactId ?? 0);

	return (
		<main className='grid grid-cols-[1fr_3fr] h-full w-full'>
			<ConversationContactDetail contactId={contactId ?? user?.user_metadata?.contactId} />

			<ConversationDetails
				contactId={contactId ?? user?.user_metadata?.contactId}
				companyId={companyId ?? user?.user_metadata?.companyId}
				communicationItems={contactCommunications}
				className='p-6'
				searchParams={searchParams}
				ticketFilter={{}}
			/>
		</main>
	);
}
